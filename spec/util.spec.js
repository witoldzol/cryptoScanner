const util = require('../built/util')

describe('Util', () => {
    it('mapDataToObject assigns properties to target object', () => {
        let a = { a: 1 }
        let b = { b: 2 }
        let c = { f: 3 }
        let sourceArray = [a, b, c]

        let f = util.mapDataToObject(sourceArray)

        expect(f['a']).toBe(1)
        expect(f['b']).toBe(2)
        expect(f['f']).toBe(3)
    })

    it('wrapDataInObjectWithMarketName returns valid object', ()=>{
        let data = [1,2,3]
        let marketName = 'EASYMONEY'

        let wrappedData = util.wrapDataInObjectWithMarketName(data, marketName)

        expect(wrappedData.hasOwnProperty(marketName)).toBe(true)
        expect(wrappedData[marketName]).toBe(data)
    })

    it('removeSpecialChars removes dashes from strings', () => {

        const data = { "ETH-BTC": { "asks": [["0.03133600", "0.01500000"]], "bids": [["0.03133200", "32.57300000"]] }, "LTC-BTC": { "asks": [["0.00501200", "3.92000000"]], "bids": [["0.00501000", "50.51000000"]] } }
        noDashData = util.removeSpecialChars(data)

        expect(noDashData.hasOwnProperty("ETHBTC")).toBe(true)
        expect(noDashData.hasOwnProperty("ETH-BTC")).toBe(false)
        expect(noDashData.hasOwnProperty("LTCBTC")).toBe(true)
        expect(noDashData.hasOwnProperty("LTC-BTC")).toBe(false)
    })
})