import util = require('./util')
import { MarketOptions } from './MarketOptions'

// const pairs: string[] = [ 'BCH-BTC','BCH-USD','BTC-EUR','BTC-GBP','BTC-USD','ETH-BTC','ETH-EUR','ETH-USD','LTC-BTC','LTC-EUR','LTC-USD','BCH-EUR']
const pairs: string[] = ['ETH-BTC', 'BCH-USD']

function removeSpecialChars(obj: object): object {
	let newObject = {}

	Object.keys(obj).forEach(key => {
		let newKey = key.replace(/[^A-Z]/g, "")
		newObject[newKey] = obj[key]
	})
	return newObject
}

function formatData(data: object): object {
	let combinedData: object = util.mapDataToObject(data)
	combinedData = removeSpecialChars(combinedData)
	return util.wrapDataInObjectWithMarketName(combinedData, this.marketName)
}

const options: MarketOptions = {
	marketName: 'GDAX',
	baseURL: 'https://api.pro.coinbase.com',
	urlPath: ['/products/', '/book?level=2'],
	pairs: pairs,
	maxConcurrentRequests: 4,
	formatData: formatData
}

export { options }