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
//call
ax.get('/api/v1/depth?symbol=LTCBTC')
    .then(res=>{
        let bids = res.data.bids
        let asks = res.data.asks
        cl(`lowest bid is : ${bids[0]}`)
        cl(`lowest ask is : ${asks[0]}`)

    })
    .catch(err=>cl(err))
