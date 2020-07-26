const rewire = require('rewire')
const gdax = rewire('../gdax')
const removeDash = gdax.__get__('removeDash')



describe('GDAX', () => {

    it('removeDash removes dashes from strings', () => {

        const data = { "ETH-BTC": { "asks": [["0.03133600", "0.01500000"]], "bids": [["0.03133200", "32.57300000"]] }, "LTC-BTC": { "asks": [["0.00501200", "3.92000000"]], "bids": [["0.00501000", "50.51000000"]] } } 
        noDashData = removeDash(data)

        expect(noDashData.hasOwnProperty("ETHBTC")).toBe(true)
        expect(noDashData.hasOwnProperty("ETH-BTC")).toBe(false)
        expect(noDashData.hasOwnProperty("LTCBTC")).toBe(true)
        expect(noDashData.hasOwnProperty("LTC-BTC")).toBe(false)
    })
})