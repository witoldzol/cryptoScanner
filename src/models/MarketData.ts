interface MarketData extends Record<string, CurrencyPair> { }

interface CurrencyPair extends Record<string, AsksBids> { }

interface AsksBids {
    asks: (string | number)[][]
    bids: (string | number)[][]
}

export { MarketData, CurrencyPair, AsksBids }