const axios = require('axios')
const axiosRetry= require('axios-retry')
const async = require('async')

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
axiosRetry(ax,{ retries: 3})

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
		       cl(res.statusCode)
		       cl('tried to get ')
		       return res
		   //     let data = {}
		   //     data[pair]['bids']=res.data.bids.slice(0,10)
		   //     data[pair]['asks']=res.data.asks.slice(0,10)
		   //     cl(data)
	           })
            .catch(e=>cl('error' + e))
    }

// get all prices for all pairs 
 async.mapLimit(pairs,1,getProductPrice,(e,res)=>
               {
		   if(e){cl(e.message)}
               })


