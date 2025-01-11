export interface StockData {
  price: number;
  timestamp: string;
}

export interface PortfolioState {
  cashBalance: number;
  stocksOwned: number;
  currentPrice: number;
}
