// const pairs = [ 'BCH-BTC','BCH-USD','BTC-EUR','BTC-GBP','BTC-USD','ETH-BTC','ETH-EUR','ETH-USD','LTC-BTC','LTC-EUR','LTC-USD','BCH-EUR']
const pairs = ['ETH-BTC', 'BCH-USD']

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
	a[this.marketName] = obj
	return a
}

exports.options = {
	marketName: 'GDAX',
	baseURL: 'https://api.pro.coinbase.com',
	urlPath: ['/products/', '/book?level=2'],
	pairs: pairs,
	maxConcurrentRequests: 4,
	formatData: formatData
}
