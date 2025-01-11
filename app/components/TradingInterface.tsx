"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePriceStream } from "./PriceStream";
import { PortfolioState } from "@/lib/types";

export default function TradingInterface() {
  const { price, error } = usePriceStream();
  const [portfolio, setPortfolio] = useState<PortfolioState>({
    cashBalance: 10000,
    stocksOwned: 0,
    currentPrice: 0,
  });

  const [tradeAmount, setTradeAmount] = useState<number>(1);

  useEffect(() => {
    console.log("Price updated:", price);
    if (typeof price === "number" && price > 0) {
      setPortfolio((prev) => ({
        ...prev,
        currentPrice: price,
      }));
    }
  }, [price]);

  const handleBuy = () => {
    const totalCost = portfolio.currentPrice * tradeAmount;

    if (totalCost <= portfolio.cashBalance) {
      setPortfolio((prev) => ({
        ...prev,
        cashBalance: prev.cashBalance - totalCost,
        stocksOwned: prev.stocksOwned + tradeAmount,
      }));
    }
  };

  const handleSell = () => {
    if (tradeAmount <= portfolio.stocksOwned) {
      const totalValue = portfolio.currentPrice * tradeAmount;
      setPortfolio((prev) => ({
        ...prev,
        cashBalance: prev.cashBalance + totalValue,
        stocksOwned: prev.stocksOwned - tradeAmount,
      }));
    }
  };

  if (error) {
    return (
      <Card className="bg-red-50">
        <CardContent className="p-4">
          <p className="text-red-600">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  // Add debug logs
  console.log("Current price state:", price);
  console.log("Current portfolio state:", portfolio);

  if (!price || portfolio.currentPrice === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-gray-600">Loading stock prices...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Heat Engineer Stock Trading</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Current Price</h3>
              <p className="text-2xl font-bold text-blue-600">
                ${portfolio.currentPrice.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Cash Balance</h3>
              <p className="text-2xl font-bold text-green-600">
                ${portfolio.cashBalance.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Stocks Owned</h3>
              <p className="text-2xl font-bold text-purple-600">
                {portfolio.stocksOwned}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trade Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Input
              type="number"
              min="1"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(parseInt(e.target.value) || 0)}
              className="w-full md:w-32"
              placeholder="Amount"
            />
            <Button
              onClick={handleBuy}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700"
              disabled={
                portfolio.currentPrice * tradeAmount > portfolio.cashBalance
              }
            >
              Buy
            </Button>
            <Button
              onClick={handleSell}
              className="w-full md:w-auto bg-red-600 hover:bg-red-700"
              disabled={tradeAmount > portfolio.stocksOwned}
            >
              Sell
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
