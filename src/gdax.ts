import util = require('./util')
import { MarketOptions } from './models/MarketOptions'
import { CurrencyPair, MarketData } from './models/MarketData'

const pairs: string[] = [ 'BCH-BTC','BCH-USD','BTC-EUR','BTC-GBP','BTC-USD','ETH-BTC','ETH-EUR','ETH-USD','LTC-BTC','LTC-EUR','LTC-USD','BCH-EUR']
// const pairs: string[] = ['ETH-BTC', 'BCH-USD']

function formatData (data: CurrencyPair[]): MarketData {
  let mappedData: CurrencyPair = util.mapDataToObject(data)
  let tickersWithoutDashes = util.removeSpecialChars(mappedData)
  return util.wrapDataInObjectWithMarketName(tickersWithoutDashes, this.marketName)
}

const gdaxOptions: MarketOptions = {
  marketName: 'GDAX',
  baseURL: 'https://api.pro.coinbase.com',
  urlPath: ['/products/', '/book?level=2'],
  pairs: pairs,
  maxConcurrentRequests: 4,
  formatData: formatData,
}

export { gdaxOptions }
