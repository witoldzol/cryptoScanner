// used for testing unexported functions
const rewire = require('rewire')
const marketService = rewire('../marketService')
const generateUrl = marketService.__get__('generateUrl')
const selectFirst10Prices = marketService.__get__('selectFirst10Prices')

describe('Market Service', () => {
    it('generateUrl returns valid URL', () => {
        const options =
        {
            urlPath: ['/depth?limit=10&symbol=', '']
        }
        const pair = 'ETH-BTC'

        let result = generateUrl(pair, options)

        expect(result).toContain('ETH-BTC')
    })

    it('selectFirst10Prices', () => {
        let asks = [['0.02564', '26.04083965', 3],
        ['0.02565', '82.09877604', 6],
        ['0.02566', '188.50761', 7],
        ['0.02567', '137.68192586', 8],
        ['0.02568', '103.44757', 4],
        ['0.02569', '0.26329221', 2],
        ['0.0257', '389.32355674', 5],
        ['0.02571', '190.69981264', 6],
        ['0.02572', '0.74084258', 2],
        ['0.02573', '428.57', 3], 
        ['0.02571', '190.69981264', 6],
        ['0.02572', '0.74084258', 2],
        ['0.02573', '428.57', 3]]

        let bids = [['225.79', '21.975', 1],
        ['225.8', '3.98083455', 2],
        ['225.81', '18', 1],
        ['225.86', '40', 1],
        ['225.87', '10.79997787', 2],
        ['225.89', '33.1724', 1],
        ['225.9', '4.8', 1],
        ['225.94', '9.33893', 2],
        ['225.97', '5.05', 2],
        ['225.98', '8.85', 1],
        ['225.79', '21.975', 1],
        ['225.8', '3.98083455', 2],
        ['225.81', '18', 1],
        ['225.86', '40', 1]]

        let response = {
            data: {
                bids: bids,
                asks: asks
            }
        }

        let pair = 'BTC-ETH'

        let result = selectFirst10Prices(pair, response)

        expect(result.hasOwnProperty(pair)).toBe(true)
        expect(result[pair]['asks'].length).toBe(10)
        expect(result[pair]['bids'].length).toBe(10)
    })
})