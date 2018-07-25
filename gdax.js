//============================== GDAX ==============================
// CONSTANTS
// ==================================================
const axios = require('axios')
const async = require('async')

// UTILITY FUNCTIONS
// ==================================================
let cl = x=>console.log(x)

// CONFIG
// ==================================================
let ax = axios.create({
    baseURL: 'https://api.pro.coinbase.com',
    timeout: 5000,
    headers: {
	    'User-Agent': 'linux chrome',
        'CB-ACCESS-KEY': 'lol'
    }
})

let urlPath = ['/products/', '/book?level=2']
let requestDelay = 1500
let retryDelay = 5000
const pairs = [ 'BCH-BTC','BCH-USD','BTC-EUR','BTC-GBP','BTC-USD','ETH-BTC','ETH-EUR','ETH-USD','LTC-BTC','LTC-EUR','LTC-USD','BCH-EUR']
// const pairs = [ 'ETH-BTC','BCH-USD']
const marketName = 'gdax'
let combineObjects = (arr,obj)=>arr.map( x=>Object.assign(obj,x) )
//removes dash from object KEYS - doesn't return, modifies original object
let removeDash = obj=>
    {
	Object.keys(obj).forEach( key=>
				  {
				      let newKey = key.replace(/[^A-Z]/g, "")
				      obj[newKey] = obj[key]
				      delete obj[key]
				  })
    }
// EXPORT
// ==============================
exports.settings =
    {
	urlPath: urlPath,
	pairs:pairs,
	requestDelay:requestDelay,
	retryDelay:retryDelay,
	ax:ax,
	maxConcurrentRequests: 4
    }

exports.formatData = (data)=>
    {
	let obj = {}
	let a = {}
	combineObjects(data,obj)
	removeDash(obj)
	a[marketName] = obj
 	return a
    }
