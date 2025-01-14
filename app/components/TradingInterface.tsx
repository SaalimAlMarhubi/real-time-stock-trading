// components/TradingInterface.tsx
"use client";

import { useState, useEffect } from "react";
import { usePriceStream } from "./PriceStream";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PortfolioState {
  cashBalance: number;
  stocksOwned: number;
  currentPrice: number;
}

export default function TradingInterface() {
  const { price, error } = usePriceStream();
  const [portfolio, setPortfolio] = useState<PortfolioState>({
    cashBalance: 10000,
    stocksOwned: 0,
    currentPrice: 0,
  });
  const [tradeAmount, setTradeAmount] = useState<number>(1);

  useEffect(() => {
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
      <Card className="bg-red-50 dark:bg-red-900">
        <CardContent className="p-4">
          <p className="text-red-600 dark:text-red-200">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!price || portfolio.currentPrice === 0) {
    return (
      <Card className="dark:bg-gray-800">
        <CardContent className="p-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Loading stock prices...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">
            Heat Engineer Stock Trading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                Current Price
              </h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                ${portfolio.currentPrice.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                Cash Balance
              </h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                ${portfolio.cashBalance.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                Stocks Owned
              </h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                {portfolio.stocksOwned}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Trade Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Input
              type="number"
              min="1"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(parseInt(e.target.value) || 0)}
              className="w-full md:w-32 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Amount"
            />
            <Button
              onClick={handleBuy}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
              disabled={
                portfolio.currentPrice * tradeAmount > portfolio.cashBalance
              }
            >
              Buy
            </Button>
            <Button
              onClick={handleSell}
              className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
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
