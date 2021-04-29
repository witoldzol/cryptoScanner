import { bitfinexOptions } from '../src/markets/bitfinex'
import { MarketData } from '../src/models/MarketData'

describe('#formatData', () => {
  const rawData = [
    [
      [
        'tBTCUSD',
        52916,
        14.05430612,
        52928,
        11.004204660000001,
        -1733,
        -0.0317,
        52928,
        7125.08522868,
        55222,
        52377,
      ],
      [
        'tLTCUSD',
        251.08,
        707.93808545,
        251.31,
        1048.17184331,
        -3.62,
        -0.0142, 251.36,
        67958.53416476, 262.73,
        248.45,
      ],
      [
        'tLTCBTC',
        0.0047437,
        450.71928697000004,
        0.0047491,
        738.21639776,
        0.0000753,
        0.0161,
        0.004749,
        5689.73085006,
        0.0048215,
        0.0046386,
      ],
    ],
  ]
  const expectedData: MarketData = {
    BTCUSD: {
      asks: [[52916, 14.05430612]], bids: [[52928, 11.004204660000001]],
    },
    LTCUSD: {
      asks: [[251.08, 707.93808545]], bids: [[251.31, 1048.17184331]],
    },
    LTCBTC: {
      asks: [[0.0047437, 450.71928697000004]],
      bids: [[0.0047491, 738.21639776]],
    },
  }
  expect(bitfinexOptions.formatData(rawData)).toEqual(expectedData)
})
