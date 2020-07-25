const async = require('async')

exports.mapDataToObject = (data) => {
	let target = {}
	data.map(source => Object.assign(target, source))
	return target
}

function delay(time, value) {
	return new Promise(resolve => setTimeout(resolve.bind(null, value), time))
}

// we have to query prices of each currency pair separately with a unique url
function generateUrl(currencyPair, options) {
	// my-url-ETH-BTC-something-bla
	let firstPartOfUrl = options.urlPath[0]
	let secondPartOfUrl = options.urlPath[1]
	return firstPartOfUrl + currencyPair + secondPartOfUrl
}

function selectFirst10Prices(pair, response) {
	let asks = response.data.asks.slice(0, 10)
	let bids = response.data.bids.slice(0, 10)

	if (asks.length == 0 || bids.length == 0) { return null }
	// wrap bids and asks in object
	let obj = {}
	obj[pair] = { asks, bids }
	return obj
}

function getPairBidsAndAsks(options) {
	return async (pair) => {
		let url = generateUrl(pair, options)
		let tries = 1
		let response = null

		try {
			response = await options.axiosInstance.get(url)
		} catch(err) {
			if(tries <= 3) {
				tries++
				response = setTimeout(await options.axiosInstance.get(url), tries * 1000)
			}
			else return err
		}

		return selectFirst10Prices(pair, response)
	}
}


exports.getPrices = async (options) => {
	const fetchPrices = getPairBidsAndAsks(options)
	
	//last arg must be a promise, that's why async is used
	return await async.mapLimit(options.pairs, options.maxConcurrentRequests, fetchPrices)
}

