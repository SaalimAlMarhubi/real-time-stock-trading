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
    let mounted = true;

    const fetchPrice = async () => {
      try {
        const response = await fetch("/api/stock-price");
        if (!response.ok) {
          throw new Error("Failed to fetch price");
        }
        const data = (await response.json()) as StockResponse;
        if (mounted && typeof data.price === "number") {
          console.log("Received price:", data.price);
          setPrice(data.price);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to fetch price");
          console.error("Error fetching price:", err);
        }
      }
    };

    // Initial fetch
    fetchPrice();

    // Set up polling interval
    const interval = setInterval(fetchPrice, 5000);

    // Cleanup function
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { price, error };
}
