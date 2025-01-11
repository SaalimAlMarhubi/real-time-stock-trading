"use client";

import { useEffect, useState } from "react";

interface StockResponse {
  price: number;
  timestamp: string;
}

export function usePriceStream() {
  const [price, setPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout | null = null;

    const connectSSE = () => {
      console.log("Setting up EventSource");
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource("/api/stock-price");

      eventSource.onopen = () => {
        console.log("SSE Connection opened");
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          console.log("Raw SSE message:", event.data);
          const data = JSON.parse(event.data) as StockResponse;
          console.log("Parsed SSE data:", data);

          if (data && typeof data.price === "number") {
            console.log("Setting new price:", data.price);
            setPrice(data.price);
          }
        } catch (err) {
          console.error("Error processing SSE message:", err);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE Connection error:", err);
        eventSource?.close();

        // Attempt to reconnect after 2 seconds
        retryTimeout = setTimeout(() => {
          console.log("Attempting to reconnect...");
          connectSSE();
        }, 2000);
      };
    };

    // Initial connection
    connectSSE();

    // Cleanup
    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);

  return { price, error };
}
