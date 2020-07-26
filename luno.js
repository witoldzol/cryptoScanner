const util = require('./util.js')

const pairs = ['XBTIDR', 'XBTMYR', 'XBTNGN', 'XBTZAR', 'ETHXBT']

// luno refers to BTC as XBT, rename for uniformity ( this value will be used in graph)
let replaceXBT = x => {
	Object.keys(x).forEach(y => {
		let newKey = y.replace('XBT', 'BTC')
		x[newKey] = x[y]
		delete x[y]
	})
}

function formatData(data){
	let combineObjects = (arr, obj) => arr.map(x => Object.assign(obj, x))
	let a = {}
	let obj = {}
	combineObjects(data, obj)
	a[this.marketName] = obj

	//get all currencies
	let l = a[this.marketName]
	//replce XBT with BTC code (they are interchangeable)

	//swap objects with arrays that hold
	let objectToArray = obj => {
		//keys = asks/bids
		Object.keys(obj)
			.forEach(x => {
				let arr = []
				//iterate over asks/bids elements
				obj[x].forEach(y => {
					let a = [y['price'], y['volume']]
					arr.push(a)
				})
				//replace object[ask/bid] with an array of results
				obj[x] = arr
				arr = []
			})
	}
	//keys = pairs
	Object.keys(l).forEach(x => objectToArray(l[x]))
	replaceXBT(a[this.marketName])
	return a
}

exports.options =
{
	marketName:'LUNO',
	baseURL: 'https://api.mybitx.com/api/1',
	urlPath: ['/orderbook?pair=', ''],
	pairs: pairs,
	maxConcurrentRequests: 2,
	formatData: formatData
}
