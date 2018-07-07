// CONSTANTS
// ==================================================
const axios = require('axios')
const util = require('./util.js')
const retryDelay = 5000 // dependent on the server settings ( this one is fussy, needs time )
const requestDelay = 1000
// UTILITY FUNCTIONS
// ==================================================

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
const pairs = [ 'XBTIDR', 'XBTMYR', 'XBTNGN', 'XBTZAR', 'ETHXBT' ]


//template for querying the prices
//it gets contatenated to the default api url
let urlPath = '/orderbook?pair='

exports.lunoPrices = util.getPrices(urlPath, pairs, requestDelay, retryDelay, ax)




//============================================================
//------------------------------ not used
//get pairs ( don't use -- they don't change much)
// let getPairs = ax.get('/tickers')
// 	.then(res=>
// 	  {
// 	      let urlArray = res.data.tickers.map(x=> x.pair)
// 	})

// //takes in array , returns array of urls
// //we feed them to 'call maker' to obtain prices for each pair
// let urlArray = pairs=>
// {
// 	return pairs.map(x=>urlPath + x)
// }
// //------------------------------
