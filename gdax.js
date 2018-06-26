const url = require('url')
const http = require('http')
const https = require('https')
const axios = require('axios')
//util
let cl=x=>console.log(x)
//instance of axios 
let ax = axios.create({
    baseURL: 'https://api.gdax.com',
    timeout: 5000,
    headers: {
	    'User-Agent': 'linux chrome',
        'CB-ACCESS-KEY': 'lol'
    }
})


//call
ax.get('products/BTC-EUR/book?level=2')
    .then(res=>{
        let bids = res.data.bids
        let asks = res.data.asks
        cl(`lowest bid is : ${bids[0]}`)
        cl(`lowest ask is : ${asks[0]}`)
    })
    .catch(err=>cl(err))




//----------------------------------------
//------------------ OLD CODE
//----------------------------------------
/*
const options = {
  hostname: 'api.gdax.com',
  port: 443,
  path: '/products',
    method: 'GET',
    headers: {
	'User-Agent': 'linux chrome'
    }
}

const req = https.request(options, (res) => {
    cl('statusCode:', res.statusCode)
    let response = ''
    res.on('data', (d) => {
    response += d
  })
    res.on('end', ()=>cl(JSON.parse(response)) )
})

req.on('error', (e) => {
  console.error(e);
})

req.end()
*/
