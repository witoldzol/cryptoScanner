interface CurrencyPair extends Record<string, AsksBids> {
}

interface MarketData extends Record<string, CurrencyPair> {
}

interface AsksBids {
  asks: number[][];
  bids: number[][];
}

export { MarketData, AsksBids, CurrencyPair }
