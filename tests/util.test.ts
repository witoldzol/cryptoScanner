import util = require('../src/util')
import { CurrencyPair } from '../src/models/MarketData'

describe('Util', () => {
  it('mapDataToObject assigns properties to target object', () => {
    let a: CurrencyPair = { 'AAABBB': {asks: [[1]], bids:[[2]] }}
    let b = { 'BBBCCC': {asks: [[3]], bids:[[4]] }}
    let c = { 'CCCDDD': {asks: [[5]], bids:[[6]] }}
    let sourceArray = [a, b, c]

    let f = util.mapDataToObject(sourceArray)

    expect(f['AAABBB']).toEqual({asks: [[1]], bids:[[2]]})
    expect(f['BBBCCC']).toEqual({asks: [[3]], bids:[[4]]})
    expect(f['CCCDDD']).toEqual({asks: [[5]], bids:[[6]]})
  })

  it('wrapDataInObjectWithMarketName returns valid object', () => {
    let data = [1, 2, 3]
    let marketName = 'EASYMONEY'

    let wrappedData = util.wrapDataInObjectWithMarketName(data, marketName)

    expect(wrappedData.hasOwnProperty(marketName)).toBe(true)
    expect(wrappedData[marketName]).toBe(data)
  })

  it('removeSpecialChars removes dashes from strings', () => {
    const data: CurrencyPair = {
      'ETH-BTC': {
        asks: [[0.03133600, 0.01500000]],
        bids: [[0.03133200, 32.57300000]],
      },
      'LTC-BTC': {
        asks: [[0.00501200, 3.92000000]],
        bids: [[0.00501000, 50.51000000]],
      },
    }
    let noDashData = util.removeSpecialChars(data)

    expect(noDashData.hasOwnProperty('ETHBTC')).toBe(true)
    expect(noDashData.hasOwnProperty('ETH-BTC')).toBe(false)
    expect(noDashData.hasOwnProperty('LTCBTC')).toBe(true)
    expect(noDashData.hasOwnProperty('LTC-BTC')).toBe(false)
  })

  it('renameXBTtoBTC replaces all instances of XBT to BTC', () => {
    const data = {
      XBTIDR: {
        asks: [
          ['159600000.00', '0.01'],
          ['159600000.00', '0.02'],
          ['159602000.00', '0.001057'],
          ['160598000.00', '0.001806'],
          ['160599000.00', '0.021977'],
          ['160600000.00', '0.10'],
          ['160621000.00', '0.01'],
          ['160860000.00', '0.0005'],
          ['160870000.00', '0.0005'],
          ['160880000.00', '0.0005'],
        ],
        bids: [
          ['159599000.00', '0.03'],
          ['159599000.00', '0.02'],
          ['159580000.00', '0.0005'],
          ['159560000.00', '0.0005'],
          ['159540000.00', '0.0005'],
          ['159520000.00', '0.0005'],
          ['159500000.00', '0.0005'],
          ['159480000.00', '0.0005'],
          ['159440000.00', '0.0005'],
          ['159420000.00', '0.0005'],
        ],
      },
      XBTMYR: {
        asks: [
          ['46098.00', '0.005464'],
          ['46099.00', '0.10'],
          ['46099.00', '0.003284'],
          ['46100.00', '0.001'],
          ['46100.00', '0.201872'],
          ['46120.00', '0.001'],
          ['46145.00', '0.199'],
          ['46147.00', '0.0007'],
          ['46147.00', '0.05'],
          ['46149.00', '0.004347'],
        ],
        bids: [
          ['46001.00', '0.048'],
          ['46000.00', '0.196716'],
          ['46000.00', '0.008766'],
          ['46000.00', '0.001'],
          ['45999.00', '0.246583'],
          ['45997.00', '0.10'],
          ['45990.00', '0.01'],
          ['45990.00', '0.10'],
          ['45950.00', '0.40001'],
          ['45901.00', '0.003'],
        ],
      },
      XBTNGN: {
        asks: [
          ['5049200.00', '0.020034'],
          ['5049600.00', '0.030156'],
          ['5049690.00', '0.001474'],
          ['5049700.00', '0.08927'],
          ['5049990.00', '0.001474'],
          ['5049995.00', '0.006351'],
          ['5049999.00', '0.022321'],
          ['5050277.00', '0.0111'],
          ['5050601.00', '0.018104'],
          ['5051106.00', '0.14885'],
        ],
        bids: [
          ['5038955.00', '0.028455'],
          ['5038955.00', '0.039566'],
          ['5038955.00', '0.001303'],
          ['5034955.00', '0.05'],
          ['5025000.00', '0.02'],
          ['5023000.00', '0.0006'],
          ['5023000.00', '0.10'],
          ['5008161.00', '0.01805'],
          ['5008101.00', '0.304837'],
          ['5008100.00', '0.017001'],
        ],
      },
      XBTZAR: {
        asks: [
          ['191010.00', '2.444205'],
          ['191010.00', '0.362431'],
          ['191010.00', '0.003699'],
          ['191010.00', '0.655046'],
          ['191010.00', '0.007519'],
          ['191010.00', '0.0576'],
          ['191010.00', '0.011825'],
          ['191010.00', '0.054482'],
          ['191010.00', '0.278674'],
          ['191010.00', '0.004511'],
        ],
        bids: [
          ['191009.00', '0.481499'],
          ['191009.00', '0.089222'],
          ['191009.00', '0.016554'],
          ['191009.00', '0.002'],
          ['191009.00', '0.50'],
          ['191009.00', '0.006518'],
          ['191009.00', '0.10'],
          ['191009.00', '3.00'],
          ['191009.00', '3.00'],
          ['191001.00', '0.491871'],
        ],
      },
      ETHXBT: {
        asks: [
          ['0.029002', '12.62'],
          ['0.029003', '0.38'],
          ['0.029006', '10.98'],
          ['0.02902', '0.07'],
          ['0.02903', '0.10'],
          ['0.02904', '0.10'],
          ['0.029047', '0.07'],
          ['0.02905', '0.10'],
          ['0.02906', '0.10'],
          ['0.02907', '0.10'],
        ],
        bids: [
          ['0.029', '0.05'],
          ['0.029', '0.20'],
          ['0.028989', '3.65'],
          ['0.028937', '0.05'],
          ['0.028925', '16.76'],
          ['0.0289', '0.01'],
          ['0.0288', '0.02'],
          ['0.028723', '71.15'],
          ['0.028722', '1.15'],
          ['0.02871', '0.10'],
        ],
      },
    }
    let noDashData = util.updateObjectKeys(data, 'XBT', 'BTC')

    expect(noDashData.hasOwnProperty('BTCIDR')).toBe(true)
    expect(noDashData.hasOwnProperty('XBTIDR')).toBe(false)
    expect(noDashData.hasOwnProperty('BTCMYR')).toBe(true)
    expect(noDashData.hasOwnProperty('XBTMYR')).toBe(false)
  })

  it('moveDataFromObjectToArray moves data from key-value pairs to array',
    () => {
      const data = {
        asks: [{ price: '170291000.00', volume: '0.016734' }],
        bids: [{ price: '170290000.00', volume: '0.004414' }],
      }

      const formattedData = util.moveDataFromObjectToArray(data)

      expect(formattedData['asks'].length).toBe(1)
      expect(formattedData['asks'][0].length).toBe(2)
    })

  it('moveDataFromObjectToArray return null if data is empty ', () => {
    const data = null

    const formattedData = util.moveDataFromObjectToArray(null)

    expect(formattedData).toBe(null)
  })

  it(
    'convertObjectToArray iterates over data and moves data from objects to arrays',
    () => {
      const data = {
        XBTIDR: {
          asks: [{ price: '170291000.00', volume: '0.016734' }],
          bids: [{ price: '170290000.00', volume: '0.004414' }],
        },
        XBTMYR: {
          asks: [{ price: '49950.00', volume: '0.048896' }],
          bids: [{ price: '49948.00', volume: '0.037998' }],
        },
      }

      const formattedData = util.convertObjectToArray(data)

      expect(formattedData['XBTIDR']['asks'].length).toBe(1)
      expect(formattedData['XBTIDR']['asks'][0].length).toBe(2)
      expect(formattedData['XBTMYR']['asks'].length).toBe(1)
      expect(formattedData['XBTMYR']['asks'][0].length).toBe(2)
    })

  it('convertObjectToArray returns null if data is invalid', () => {
    const data = null

    const formattedData = util.convertObjectToArray(data)

    expect(formattedData).toBe(null)
  })
})
