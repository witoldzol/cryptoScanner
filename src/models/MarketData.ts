interface MarketData extends Record<string, AsksBids> {
}

interface MarketRates extends Record<string, number> {
}

interface AsksBids {
  asks: number[][];
  bids: number[][];
}

export { MarketData, AsksBids, MarketRates }
