import { MarketData } from './MarketData'
import { Market } from '../markets/Market'

export const EmptyMarketData: MarketData = {
  [Market.BITFINEX]: {
    '': {
      asks: [[]],
      bids: [[]],
    },
  },
}
