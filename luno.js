const axios = require('axios')
const async = require('async')
const bn = require('bottleneck')

const retryDelay = 5000 // dependent on the server settings ( this one is fussy, needs time )
//const exports = module.exports
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
//this is a delay PROMISE (normal setTimeout won't work inside promises)
let delay = (t,v)=>
    {
	return new Promise( resolve=> setTimeout(resolve.bind(null,v), t) )
    }

let getPrice = async pair=>
    {
	return await ax.get( makeUrl(pair) )
	    .then( function(result){ return Promise.retry(getPrice,3,5000)})
	    // .then(()=>cl('done'))
	    // .catch(e=>{ delay(3000).then( x=>getPrice)})
	    // .then( x=>x )
	

    }

Promise.retry = function( fn, times, delay)
{
    return new Promise( (resolve,reject)=>
			{
			    let err
			    let attempt = ()=>
				{
				    if(times == 0) {reject(err)}
				    else
				    {
					fn().then( res=>cl('result returned') )
					    .catch( e=>{times--; err = e; cl('retry9ing');setTimeout( ()=>attempt(),4000)})
				    }
				}
			    attempt()
			})
}

async.mapLimit(pairs,4, getPrice,(e,res)=>
               {
		   if(e){cl(e.message)}
		   cl(res)
               })

/*
//get current prices of given pair
let getProductPrice = async (pair, n)=>
    {
	if(!n){n=1}
	//create url to query orderbook
	let url = makeUrl(pair)
	//make a call
        await ax.get(url)
            .then( res=>
                   {
		       let a={}
		       cl('returning data')
		       return a[pair]=res 
	           })
            .catch(e=>
		   {
		       let code = e.response.status
		       cl('error code : ' + code)
		       if(code == 429 && n<4)
		       {
			   delay(retryDelay).then( ()=>
					     {
						 return getProductPrice(pair, n+1).then( x=>{cl(n+1)}).catch(e=>cl(e))
					     })

		       }
		   })
	    .then(res=>{return res})
    }
*/

exports.getPrice = async pair=>
    {
	console.log('starting fun')
	return await ax.get( makeUrl(pair) )
	    .then(res=>{console.log(`sending data on ${pair} from luno`); return res.data.asks.slice(0,10)})
	    .catch( e=>console.log(e) )
    }

// // get all prices for all pairs 
// async.mapLimit(pairs,4, getProductPrice,(e,res)=>
//                {
// 		   if(e){cl(e.message)}
// 		   cl(res)
//                })

// -----------------------------
// ------------------------------
// ------------------------------

