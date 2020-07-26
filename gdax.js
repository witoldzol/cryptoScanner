const util = require('./util')

// const pairs = [ 'BCH-BTC','BCH-USD','BTC-EUR','BTC-GBP','BTC-USD','ETH-BTC','ETH-EUR','ETH-USD','LTC-BTC','LTC-EUR','LTC-USD','BCH-EUR']
const pairs = ['ETH-BTC', 'BCH-USD']

//removes dash from object KEYS
let removeDash = obj => {
	// todo: remove once we have types
	if( Array.isArray(obj)) obj = obj[0]
	let newObject = {}

	Object.keys(obj).forEach(key => {
		let newKey = key.replace(/[^A-Z]/g, "")
		newObject[newKey] = obj[key]
	})
	return newObject
}

function formatData(data){
	let combinedData = util.mapDataToObject(data)
	combinedData = removeDash(combinedData)
	return util.wrapDataInObjectWithMarketName(combinedData, this.marketName)
}

exports.options = {
	marketName: 'GDAX',
	baseURL: 'https://api.pro.coinbase.com',
	urlPath: ['/products/', '/book?level=2'],
	pairs: pairs,
	maxConcurrentRequests: 4,
	formatData: formatData
}
