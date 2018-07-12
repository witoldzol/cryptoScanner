//============================== GDAX ==============================
// CONSTANTS
// ==================================================
const axios = require('axios')
const async = require('async')
const util = require('./util.js')

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

// EXPORT
// ==============================
let settings=
    {
	urlPath: urlPath,
	pairs:pairs,
	requestDelay:requestDelay,
	retryDelay:retryDelay,
	ax:ax,
	maxConcurrentRequests: 4
    }

exports.settings = settings
