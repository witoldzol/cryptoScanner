import { Market } from '../src/markets/Market'
import { bitfinexOptions } from '../src/markets/bitfinex'
import { CurrencyPair, MarketData } from '../src/models/MarketData'

describe('#formatData', () => {
  it('should return formatted Market Data', function () {

    const rawData = [
      [
        [
          'tXLMUSD',
          0.55047,
          322077.54407740006,
          0.55099,
          103426.53996987,
          0.00043,
          0.0008,
          0.55047,
          2885141.47807072,
          0.57276,
          0.538,
        ],
        [
          'tXLMBTC',
          0.00000959,
          993269.49997242,
          0.00000961,
          1110681.64212954,
          -7e-8,
          -0.0007,
          0.0000096,
          536400.4325794,
          0.00000988,
          0.00000945,
        ],
        [
          'tXLMETH',
          0.00016724,
          421517.64911617,
          0.00016816,
          465651.13811044995,
          -0.00001898,
          -0.1014,
          0.0001682,
          342131.1753997,
          0.00018897,
          0.00016699,
        ],
      ]]
    const expectedData: MarketData = {
      [Market.BITFINEX]: {
        XLMUSD: {
          asks: [[0.55099]], bids: [[0.55047]],
        },
        XLMBTC: {
          asks: [[0.00000961]], bids: [[0.00000959]],
        },
        XLMETH: {
          bids: [[0.00016724]],
          asks: [[0.00016816]],
        },
      },
    }
    expect(bitfinexOptions.formatData(rawData)).toEqual(expectedData)
  })
  it('should return empty object when no data passed in', function () {
    const rawData = []
    const expectedData: MarketData = {[Market.BITFINEX]:{'':{bids:[[]], asks: [[]]}}}
    expect(bitfinexOptions.formatData(rawData)).toEqual(expectedData)
  })
})
