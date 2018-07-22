//====================================================== UTILS =================================

//MODULES
// ==============================
const axios = require('axios')
const async = require('async')
const cl = x=>console.log(x)
// EXPORTS
// ==============================
let combineObjects = (arr,obj)=>arr.map( x=>Object.assign(obj,x) )

exports.formatData = (data)=>
    {
	let obj = {}
	combineObjects(data,obj)
	return obj
    }



//returns promise that waits for specific time and returns specified value (can be null)
exports.delay = (time, value)=>
{
    return new Promise( resolve=>setTimeout( resolve.bind(null, value), time))
}


// ======================================== GET PRICES 
exports.getPrices = (options)=>
    {
	let delay = (time, value)=>
	    {
		return new Promise( resolve=>setTimeout( resolve.bind(null, value), time))
	    }
	// let combineObjects = (arr,obj)=>arr.map( x=>Object.assign(obj,x) )
	
	let makeUrl = x=>options.urlPath[0] + x + options.urlPath[1]
	
	// try without async / await
	let getPrice = async pair=>
	    {
		return await options.ax.get( makeUrl(pair) )
	    }

	let formatData = (pair,response)=>
	    {
		let asks = response.data.asks.slice(0,10)
		let bids = response.data.bids.slice(0,10)
		let obj = {}
		obj[pair] = {asks,bids}
		return obj
	    }
	
	let outerPromise = async (pair)=>
	    {
		console.log('from outer promise : currency pair is : ' + pair)
		return new Promise( (resolve,reject)=>
				    {
					let attempt = (n)=>
					    {
						return getPrice(pair)
						// this exchange returns WHOLE BOOK, so we need to slice it,
						// first arg is delay, second arg is the returned data
						    .then(res=>resolve(delay(options.requestDelay, formatData(pair, res))))
						    // .then(res=>resolve(delay(options.requestDelay, res.data.asks.slice(0,10)))) 
						    .catch(e=>
							   {
							       if(n<=3)
							       {
								   cl('error inside getPrice : ===> ' + e )
								   console.log('retry number ' + n + ' currency pair: ' + pair)                   
								   delay( options.retryDelay * n, '' ).then( ()=>attempt(n+1))
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
				
				async.mapLimit( options.pairs, options.maxConcurrentRequests, outerPromise, (e,res)=>
					       {
						   if(e){reject(e)}					
						   //custom data formatting ( will have to change from market to market
						   resolve(res)
					       })
			    })
    }



// ======================================== GET PRICES 
// old version
//----------------------------------------------------
// exports.getPrices = (urlPath, pairs, requestDelay, retryDelay, ax, maxConcurrentRequests )=>
//     {
// 	let delay = (time, value)=>
// 	    {
// 		return new Promise( resolve=>setTimeout( resolve.bind(null, value), time))
// 	    }

// 	let makeUrl = x=>urlPath[0] + x + urlPath[1]
	
// 	// try without async / await
// 	let getPrice = async pair=>
// 	    {
// 		return await ax.get( makeUrl(pair) )
// 	    }


// 	let outerPromise = async (pair)=>
// 	    {
// 		console.log('from outer promise : currency pair is : ' + pair)
// 		return new Promise( (resolve,reject)=>
// 				    {
// 					let attempt = (n)=>
// 					    {
// 						return getPrice(pair)
// 						// this exchange returns WHOLE BOOK, so we need to slice it
// 						    .then(res=>resolve(delay(requestDelay, res.data.asks.slice(0,10)))) 
// 						    .catch(e=>
// 							   {
// 							       if(n<=3)
// 							       {
// 								   console.log('retry number ' + n + ' currency pair: ' + pair)                   
// 								   delay( retryDelay * n, '' ).then( ()=>attempt(n+1))
// 							       }  
// 							       else
// 							       {
// 								   return reject(e.response.status)
// 							       }
// 							   })
// 					    }
// 					attempt(1)
// 				    })
// 		    .then(res=>res)
// 		    .catch(e=>e)
// 	    }

	
// 	return new Promise( (resolve, reject)=>
// 			    {
				
// 				async.mapLimit(pairs, maxConcurrentRequests, outerPromise,(e,res)=>
// 					       {
// 						   if(e){reject(e)}
// 						   resolve(res)
// 					       })
// 			    })
//     }
