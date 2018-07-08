//MODULES
// ==============================
const axios = require('axios')
const async = require('async')

// EXPORTS
// ==============================
//returns promise that waits for specific time and returns specified value (can be null)
exports.delay = (time, value)=>
{
    return new Promise( resolve=>setTimeout( resolve.bind(null, value), time))
}

// ======================================== GET PRICES 
exports.getPrices = (urlPath, pairs, requestDelay, retryDelay, ax, maxConcurrentRequests )=>
    {
	let delay = (time, value)=>
	    {
		return new Promise( resolve=>setTimeout( resolve.bind(null, value), time))
	    }

	let makeUrl = x=>urlPath + x
	
	// try without async / await
	let getPrice = async pair=>
	    {
		return await ax.get( makeUrl(pair) )
	    }


	let outerPromise = async (pair)=>
	    {
		console.log('from outer promise : currency pair is : ' + pair)
		return new Promise( (resolve,reject)=>
				    {
					let attempt = (n)=>
					    {
						return getPrice(pair)
						// this exchange returns WHOLE BOOK, so we need to slice it
						    .then(res=>resolve(delay(requestDelay, res.data.asks.slice(0,10)))) 
						    .catch(e=>
							   {
							       if(n<=3)
							       {
								   console.log('retry number ' + n + ' currency pair: ' + pair)                   
								   delay( retryDelay * n, '' ).then( ()=>attempt(n+1))
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

	
	return new Promise( (resolve, reject)=>
			    {
				
				async.mapLimit(pairs, maxConcurrentRequests, outerPromise,(e,res)=>
					       {
						   if(e){reject(e)}
						   resolve(res)
					       })
			    })
    }



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
