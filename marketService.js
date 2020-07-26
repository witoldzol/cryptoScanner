const async = require('async')
const axios = require('axios')

// we have to query prices of each currency pair separately with a unique url
function generateUrl(currencyPair, options) {
	let firstPartOfUrl = options.urlPath[0]
	let secondPartOfUrl = options.urlPath[1]
	return firstPartOfUrl + currencyPair + secondPartOfUrl
}

function selectFirst10Prices(pair, response) {
	let asks = response.data.asks.slice(0, 10)
	let bids = response.data.bids.slice(0, 10)

	if (asks.length == 0 || bids.length == 0) { return null }
	let obj = {}
	obj[pair] = { asks, bids }
	return obj
}

function getAxios(options) {
	return axios.create({
		baseURL: options.baseURL,
		timeout: 5000
	})
}

function fetchPrices(options) {
	const axios = getAxios(options)

	return async (pair) => {
		let url = generateUrl(pair, options)
		let tries = 1
		let response = null

		try {
			response = await axios.get(url)
		} catch (err) {
			if (tries <= 3) {
				tries++
				response = setTimeout(await axios.get(url), tries * 2000)
			}
			else return err
		}

		return selectFirst10Prices(pair, response)
	}
}



exports.getPrices = async (options) => {
	const fetchPricesWithOptions = fetchPrices(options)
	//last arg must be a promise, that's why async is used
	return await async.mapLimit(options.pairs, options.maxConcurrentRequests, fetchPricesWithOptions)
		.then(data => options.formatData(data))
}

