const axios = require('axios')
const qs = require('querystring')
//util
let cl=x=>console.log(x)
//instance of axios 
let ax = axios.create({
    baseURL: 'https://api.binance.com',
    timeout: 5000,
    headers: {
	    'User-Agent': 'linux chrome',
        'CB-ACCESS-KEY': 'lol',
    }
})

ax.get('/api/v1/exchangeInfo')
    .then(res=>
	  {
	      //build array of currency pairs (365 items!)
	      let arr=res.data.symbols.map(x=>x.symbol)
	      cl(arr.length)
	  })
	  .catch(e=>cl(e))

// //call
// ax.get('/api/v1/depth?symbol=LTCBTC')
//     .then(res=>{
//         let bids = res.data.bids
//         let asks = res.data.asks
//         cl(`lowest bid is : ${bids[0]}`)
//         cl(`lowest ask is : ${asks[0]}`)

//     })
//     .catch(err=>cl(err))

