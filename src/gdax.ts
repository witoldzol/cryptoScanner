import util = require('./util')
import { MarketOptions } from './models/MarketOptions'
import { MarketData } from './models/MarketData'

const pairs: string[] = [ 'BCH-BTC','BCH-USD','BTC-EUR','BTC-GBP','BTC-USD','ETH-BTC','ETH-EUR','ETH-USD','LTC-BTC','LTC-EUR','LTC-USD','BCH-EUR']
// const pairs: string[] = ['ETH-BTC', 'BCH-USD']

function formatData (data: object[]): MarketData {
  console.log('gdax', data)
  let combinedData: object = util.mapDataToObject(data)
  return util.wrapDataInObjectWithMarketName(combinedData, this.marketName)
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
