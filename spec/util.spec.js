const util = require('../util')

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
})