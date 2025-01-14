import { NextResponse } from "next/server";
import { Kafka, logLevel, Partitioners } from "kafkajs";

// Initialise Kafka client
const kafka = new Kafka({
  clientId: "heat-engineer-producer",
  brokers: ["localhost:29092"],
  logLevel: logLevel.INFO,
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

const consumer = kafka.consumer({ groupId: "heat-engineer-group" });

// Create a state object to manage connections
const state = {
  isProducerConnected: false,
  isConsumerConnected: false,
  intervalId: null as NodeJS.Timeout | null,
  isControllerActive: false,
};

// Function to fetch stock price
async function fetchStockPrice() {
  try {
    const response = await fetch(
      "https://stocks.heat-engineer.dev/api/stocks/heat-engineer/current",
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch stock price");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching stock price:", error);
    throw error;
  }
}

// Function to send price to Kafka topic
async function sendToKafka(price: number, timestamp: string) {
  if (!state.isProducerConnected) {
    await producer.connect();
    state.isProducerConnected = true;
    console.log("Kafka producer connected");
  }

  await producer.send({
    topic: "heat-engineer-stock-prices",
    messages: [
      {
        value: JSON.stringify({ price, timestamp }),
      },
    ],
  });
}

interface StockPriceMessage {
  price: number;
  timestamp: string;
}

// Helper function to send SSE message
function sendSSEMessage(
  controller: ReadableStreamDefaultController,
  data: StockPriceMessage
) {
  try {
    if (state.isControllerActive) {
      const message = `data: ${JSON.stringify(data)}\n\n`;
      controller.enqueue(new TextEncoder().encode(message));
    }
  } catch (error) {
    console.error("Error sending SSE message:", error);
  }
}

export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      state.isControllerActive = true;

      // Initial price fetch and send
      try {
        const initialData = await fetchStockPrice();
        sendSSEMessage(controller, {
          price: initialData.price,
          timestamp: initialData.timestamp,
        });

        // Set up Kafka consumer
        if (!state.isConsumerConnected) {
          await consumer.connect();
          await consumer.subscribe({
            topic: "heat-engineer-stock-prices",
            fromBeginning: false,
          });

          await consumer.run({
            eachMessage: async ({ message }) => {
              if (message.value && state.isControllerActive) {
                const data = JSON.parse(message.value.toString());
                sendSSEMessage(controller, data);
              }
            },
          });

          state.isConsumerConnected = true;
        }

        // Set up producer interval if not already running
        if (!state.intervalId) {
          state.intervalId = setInterval(async () => {
            try {
              if (state.isControllerActive) {
                const stockData = await fetchStockPrice();
                await sendToKafka(stockData.price, stockData.timestamp);
                sendSSEMessage(controller, {
                  price: stockData.price,
                  timestamp: stockData.timestamp,
                });
              }
            } catch (error) {
              console.error("Error in producer interval:", error);
            }
          }, 5000);
        }
      } catch (error) {
        console.error("Error in SSE stream:", error);
        state.isControllerActive = false;
        controller.error(error);
      }
    },
    cancel() {
      state.isControllerActive = false;
      if (state.isConsumerConnected) {
        consumer.disconnect();
        state.isConsumerConnected = false;
      }
      if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = null;
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function DELETE() {
  try {
    state.isControllerActive = false;
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
      console.log("Kafka producer interval cleared");
    }
    if (state.isProducerConnected) {
      await producer.disconnect();
      state.isProducerConnected = false;
      console.log("Kafka producer disconnected");
    }
    if (state.isConsumerConnected) {
      await consumer.disconnect();
      state.isConsumerConnected = false;
      console.log("Kafka consumer disconnected");
    }
    return NextResponse.json({ status: "Service stopped" });
  } catch (error) {
    console.error("Failed to stop service:", error);
    return NextResponse.json(
      { error: "Failed to stop service" },
      { status: 500 }
    );
  }
}
