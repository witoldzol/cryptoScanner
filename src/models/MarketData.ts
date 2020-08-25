interface MarketData extends Record<string, CurrencyPair> {}

interface CurrencyPair extends Record<string, AsksBids> {}

interface MarketRates extends Record<string, number> {}

interface AsksBids {
  asks: number[][];
  bids: number[][];
}

export { MarketData, CurrencyPair, AsksBids, MarketRates };
