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
const pairs = ['ETHXBT', 'XBTIDR' ]

//template for querying the prices
//(array in order to handle more complex queries, first ele + currency + second ele of query)
//it gets contatenated to the default api url
let urlPath = ['/orderbook?pair=', '']
let combineObjects = (arr,obj)=>arr.map( x=>Object.assign(obj,x) )
let marketName = 'luno'

// EXPORTS
// ==============================
exports.settings =
    {
	urlPath: urlPath,
	pairs:pairs,
	requestDelay:requestDelay,
	retryDelay:retryDelay,
	ax:ax,
	maxConcurrentRequests: 2,
    }

exports.formatData = (data)=>
    {
	let obj = {}
	let a = {}
	combineObjects(data,obj)
	a[marketName] = obj

	//get all currencies
	let l = a['luno']
	//swap objects with arrays that hold
	let objectToArray = obj=>
	    {
		//keys = asks/bids
		Object.keys(obj)
		    .forEach(x=>
			     {
				 let arr = []
				 //iterate over asks/bids elements
				 obj[x].forEach( y=>
						 {
						     let a = [y['price'],y['volume']]
						     arr.push(a)
						 })
				 //replace object[ask/bid] with an array of results
				 obj[x] = arr
				 arr = []
			     })
	    }
	//keys = pairs
	Object.keys(l).forEach(x=>objectToArray( l[x] ) )
	return a
    }

