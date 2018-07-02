const axios = require('axios')
const async = require('async')
const rax = require('retry-axios')

//util
let cl=x=>console.log(x)
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

const interceptorId = rax.attach();
let f = async ()=>{
await    ax.get('/orderbook?pair=XBTIDR').then(x=>cl('data')).catch(e=>cl(e.response.status))
await    ax.get('/orderbook?pair=XBTIDR').then(x=>cl('data 2')).catch(e=>cl(e.response.status))
await     ax.get('/orderbook?pair=XBTIDR').then(x=>cl('data 3')).catch(e=>cl(e.response.status))
await    ax.get('/orderbook?pair=XBTIDR').then(x=>cl('data 4')).catch(e=>cl(e.response.status))
await    ax.get('/orderbook?pair=XBTIDR').then(x=>cl('data 5')).catch(e=>cl(e.response.status))
}
f()
/*
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

//get current prices of given pair
let getProductPrice = async pair=>
    {
	//create url to query orderbook
	let url = makeUrl(pair)
	//make a call
        await ax.get(url)
            .then( res=>
                   {
		       cl('returning data')
	           })
            .catch(e=>{cl('error code : ' + e.response.status)})
    }

// get all prices for all pairs 
async.mapLimit(pairs,1,getProductPrice,(e,res)=>
               {
		   if(e){cl(e.message)}
		   cl(res.data)
               })

// -----------------------------
// ------------------------------
// ------------------------------

*/
