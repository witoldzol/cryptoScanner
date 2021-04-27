import util = require('./../util')
import { MarketOptions } from './../models/MarketOptions'
import { MarketData } from './../models/MarketData'

const pairs: string[] = ['ALL']

function formatData (data: object[]): MarketData {
  console.log('data is:', data)
  // let combinedData: object = util.mapDataToObject(data)
  // combinedData = util.removeSpecialChars(combinedData)
  // return util.wrapDataInObjectWithMarketName(combinedData, this.marketName)
}

const bitfinexOptions: MarketOptions = {
  marketName: 'BITFINEX',
  baseURL: 'https://api-pub.bitfinex.com/',
  // first element is before, latter, after ticker
  // eg ['/v2','level=2'] => sample url: foo/bar/v2/BTCUTC/level=2
  urlPath: ['/v2/tickers?symbols=', ''],
  pairs: pairs,
  maxConcurrentRequests: 1,
  formatData: formatData,
}

export { bitfinexOptions }
