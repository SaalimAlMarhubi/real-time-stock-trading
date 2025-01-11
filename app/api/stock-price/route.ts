import { NextResponse } from "next/server";
import { Kafka, logLevel, Partitioners } from "kafkajs";

// Initialize Kafka client
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

// Create a state object to manage producer connection
const state = {
  isProducerConnected: false,
  intervalId: null as NodeJS.Timeout | null,
};

// Function to fetch stock price
async function fetchStockPrice() {
  try {
    const response = await fetch(
      "https://stocks.heat-engineer.dev/api/stocks/heat-engineer/current",
      { cache: "no-store" } // Disable caching
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

export async function GET() {
  try {
    if (!state.intervalId) {
      state.intervalId = setInterval(async () => {
        try {
          const stockData = await fetchStockPrice();
          await sendToKafka(stockData.price, stockData.timestamp);
          console.log("Sent to Kafka:", stockData);
        } catch (error) {
          console.error("Error in producer interval:", error);
        }
      }, 5000);
      console.log("Kafka producer interval started");
    }

    // Fetch current price immediately and return it
    const stockData = await fetchStockPrice();
    return NextResponse.json({
      status: "Producer running",
      price: stockData.price,
      timestamp: stockData.timestamp,
    });
  } catch (error) {
    console.error("Failed to start producer:", error);
    return NextResponse.json(
      { error: "Failed to start producer" },
      { status: 500 }
    );
  }
}
export async function DELETE() {
  try {
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
    return NextResponse.json({ status: "Producer stopped" });
  } catch (error) {
    console.error("Failed to stop producer:", error);
    return NextResponse.json(
      { error: "Failed to stop producer" },
      { status: 500 }
    );
  }
}
