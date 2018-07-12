//============================== LUNO ==============================
// CONSTANTS
// ==================================================
const axios = require('axios')
const util = require('./util.js')
const retryDelay = 5000 // dependent on the server settings ( this one is fussy, needs time )
const requestDelay = 1000
// UTILITY FUNCTIONS
// ==================================================
let cl = x=>console.log(x)
// CONFIG
// ==================================================

//instance of axios 
let ax = axios.create(
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
// const pairs = [ 'XBTIDR', 'XBTMYR', 'XBTNGN', 'XBTZAR', 'ETHXBT' ]
const pairs = [ 'XBTIDR', 'XBTMYR', 'XBTNGN', 'ETHXBT' ]


//template for querying the prices
//(array in order to handle more complex queries, first ele + currency + second ele of query)
//it gets contatenated to the default api url
let urlPath = ['/orderbook?pair=', '']

// EXPORT
// ==============================
let settings=
    {
	urlPath: urlPath,
	pairs:pairs,
	requestDelay:requestDelay,
	retryDelay:retryDelay,
	ax:ax,
	maxConcurrentRequests: 2
    }

let formatSetting = 
    {
	
    }

let formatData = ()=>
    {
	
    }


exports.settings = settings
