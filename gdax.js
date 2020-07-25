const axios = require('axios')

let axiosInstance = axios.create({
	baseURL: 'https://api.pro.coinbase.com',
	timeout: 5000,
	headers: {
		'User-Agent': 'linux chrome',
		'CB-ACCESS-KEY': 'lol'
	}
})

// const pairs = [ 'BCH-BTC','BCH-USD','BTC-EUR','BTC-GBP','BTC-USD','ETH-BTC','ETH-EUR','ETH-USD','LTC-BTC','LTC-EUR','LTC-USD','BCH-EUR']
const pairs = ['ETH-BTC', 'BCH-USD']
const marketName = 'GDAX'

//removes dash from object KEYS - doesn't return, modifies original object
let removeDash = obj => {
	Object.keys(obj).forEach(key => {
		let newKey = key.replace(/[^A-Z]/g, "")
		obj[newKey] = obj[key]
		delete obj[key]
	})
}

function formatData(data){
	let combineObjects = (arr, obj) => arr.map(x => Object.assign(obj, x))
	let obj = {}
	let a = {}
	combineObjects(data, obj)
	removeDash(obj)
	a[marketName] = obj
	return a
}

exports.options = {
	baseURL: 'https://api.pro.coinbase.com',
	urlPath: ['/products/', '/book?level=2'],
	pairs: pairs,
	axiosInstance: axiosInstance,
	maxConcurrentRequests: 4,
	formatData: formatData
}
