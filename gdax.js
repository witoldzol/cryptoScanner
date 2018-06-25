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
	'User-Agent': 'linux chrome'}
})
	
//call
ax.get('/products')
    .then(res=>cl(res))
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
