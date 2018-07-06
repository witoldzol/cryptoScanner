// CONSTANTS
// ==================================================
const axios = require('axios')
const async = require('async')
const bn = require('bottleneck')
const util = require('./util.js')
const delayTimer = 5000 // dependent on the server settings ( this one is fussy, needs time )

// UTILITY FUNCTIONS
// ==================================================

const cl=x=>console.log(x)
const delay = util.delay

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

//get pairs ( don't use -- they don't change much)
let getPairs = ax.get('/tickers')
	.then(res=>
	  {
	      let urlArray = res.data.tickers.map(x=> x.pair)
	})

//template for querying the prices
//it gets contatenated to the default api url
let urlPath = '/orderbook?pair='

//takes in array , returns array of urls
//we feed them to 'call maker' to obtain prices for each pair
let urlArray = pairs=>
{
	return pairs.map(x=>urlPath + x)
}

let makeUrl = x=>urlPath + x


let getPrice = async pair=>
{
    return await ax.get( makeUrl(pair) )
	// .then(res=>{console.log(`sending data on ${pair} from luno`); return res.data.asks.slice(0,2)})
	// .catch( e=>e.response.status)
}

let outerPromise = async (val)=>
{
	return new Promise( (resolve,reject)=>
	{
		let tries = 1
		let attempt = (n)=>
		{
		    return getPrice(val)
			.then(res=>resolve(res.data.asks.slice(0,2)))
			.catch(e=>
			       {
				   if(n<3)
				   {
				       cl('retry')                   
				       delay( delayTimer, '' ).then( ()=>attempt(n+1))
				   }  
				   else
				   {
				       return reject(e.response.status)
				   }
			       })
		}
		attempt(1)
	})
		.then(res=>res)
		.catch(e=>e)
}


async.mapLimit(pairs,4, outerPromise,(e,res)=>
{
		   if(e){cl(e.message)}
		   cl(res)
})

