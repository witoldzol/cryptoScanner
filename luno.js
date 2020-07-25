//============================== LUNO ==============================
// CONSTANTS
// ==================================================
const axios = require('axios')
const util = require('./marketService.js')
const retryDelay = 5000 // dependent on the server settings ( this one is fussy, needs time )
const requestDelay = 1000
const transactionCost = 1

// CONFIG
// ==================================================

//instance of axios 
let axiosInstance = axios.create(
	{
		baseURL: 'https://api.mybitx.com/api/1',
		timeout: 5000,
		headers:
		{
			'User-Agent': 'linux chrome',
			'CB-ACCESS-KEY': 'lol'
		}
	})

//currency pairs available on this exchang //XBT = BTC
const pairs = ['XBTIDR', 'XBTMYR', 'XBTNGN', 'XBTZAR', 'ETHXBT']

//template for querying the prices
//(array in order to handle more complex queries, first ele + currency + second ele of query)
//it gets contatenated to the default api url
let urlPath = ['/orderbook?pair=', '']
let marketName = 'luno'
let replaceXBT = x => {
	Object.keys(x).forEach(y => {
		let newKey = y.replace('XBT', 'BTC')
		x[newKey] = x[y]
		delete x[y]
	})
}


function formatData(data){
	let a = {}
	let obj = util.mapDataToObject(data)
	a[marketName] = obj

	//get all currencies
	let l = a['luno']
	//replce XBT with BTC code (they are interchangeable)

	//swap objects with arrays that hold
	let objectToArray = obj => {
		//keys = asks/bids
		Object.keys(obj)
			.forEach(x => {
				let arr = []
				//iterate over asks/bids elements
				obj[x].forEach(y => {
					let a = [y['price'], y['volume']]
					arr.push(a)
				})
				//replace object[ask/bid] with an array of results
				obj[x] = arr
				arr = []
			})
	}
	//keys = pairs
	Object.keys(l).forEach(x => objectToArray(l[x]))
	replaceXBT(a['luno'])
	return a
}


exports.options =
{
	baseURL: 'https://api.mybitx.com/api/1',
	urlPath: urlPath,
	pairs: pairs,
	requestDelay: requestDelay,
	retryDelay: retryDelay,
	axiosInstance: axiosInstance,
	maxConcurrentRequests: 2,
	formatData: formatData
}
