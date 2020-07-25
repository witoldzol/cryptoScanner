//============================== BINANCE ==============================
const axios = require('axios')
const marketService = require('./marketService.js')

// CONFIG
// ==================================================

//instance of axios 
let axiosInstance = axios.create({
	baseURL: 'https://api.binance.com/api/v1',
	timeout: 5000,
	headers: {
		'User-Agent': 'linux chrome',
		'CB-ACCESS-KEY': 'lol',
	}
})

//url path[0] + currency pair + path[1]
let urlPath = ['/depth?limit=10&symbol=', '']
let requestDelay = 250
let retryDelay = 5000
const marketName = 'binance'

let pairsUnfiltered = ['ETHBTC', 'LTCBTC']
//let pairsUnfiltered = ['ETHBTC','LTCBTC','BNBBTC','NEOBTC','QTUMETH','EOSETH','SNTETH','BNTETH','BCCBTC','GASBTC','BNBETH','BTCUSDT','ETHUSDT','HSRBTC','OAXETH','DNTETH','MCOETH','ICNETH','MCOBTC','WTCBTC','WTCETH','LRCBTC','LRCETH','QTUMBTC','YOYOBTC','OMGBTC','OMGETH','ZRXBTC','ZRXETH','STRATBTC','STRATETH','SNGLSBTC','SNGLSETH','BQXBTC','BQXETH','KNCBTC','KNCETH','FUNBTC','FUNETH','SNMBTC','SNMETH','NEOETH','IOTABTC','IOTAETH','LINKBTC','LINKETH','XVGBTC','XVGETH','SALTBTC','SALTETH','MDABTC','MDAETH','MTLBTC','MTLETH','SUBBTC','SUBETH','EOSBTC','SNTBTC','ETCETH','ETCBTC','MTHBTC','MTHETH','ENGBTC','ENGETH','DNTBTC','ZECBTC','ZECETH','BNTBTC','ASTBTC','ASTETH','DASHBTC']

//filter out cryptos that have more than 3 letters
let pairs = pairsUnfiltered.filter(ele => ele.length == 6)


function formatData(data){
	let combineObjects = (arr, obj) => arr.map(x => Object.assign(obj, x))
	let obj = {}
	let a = {}
	combineObjects(data, obj)
	a[marketName] = obj
	return a
}

exports.options =
{
	urlPath: urlPath,
	pairs: pairs,
	requestDelay: requestDelay,
	retryDelay: retryDelay,
	axiosInstance: axiosInstance,
	maxConcurrentRequests: 20,
	formatData: formatData
}
