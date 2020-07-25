let pairsUnfiltered = ['ETHBTC', 'LTCBTC']
// let pairsUnfiltered = ['ETHBTC','LTCBTC','BNBBTC','NEOBTC','QTUMETH','EOSETH','SNTETH','BNTETH','BCCBTC','GASBTC','BNBETH','BTCUSDT','ETHUSDT','HSRBTC','OAXETH','DNTETH','MCOETH','ICNETH','MCOBTC','WTCBTC','WTCETH','LRCBTC','LRCETH','QTUMBTC','YOYOBTC','OMGBTC','OMGETH','ZRXBTC','ZRXETH','STRATBTC','STRATETH','SNGLSBTC','SNGLSETH','BQXBTC','BQXETH','KNCBTC','KNCETH','FUNBTC','FUNETH','SNMBTC','SNMETH','NEOETH','IOTABTC','IOTAETH','LINKBTC','LINKETH','XVGBTC','XVGETH','SALTBTC','SALTETH','MDABTC','MDAETH','MTLBTC','MTLETH','SUBBTC','SUBETH','EOSBTC','SNTBTC','ETCETH','ETCBTC','MTHBTC','MTHETH','ENGBTC','ENGETH','DNTBTC','ZECBTC','ZECETH','BNTBTC','ASTBTC','ASTETH','DASHBTC']
let pairs = pairsUnfiltered.filter(ele => ele.length == 6)

function formatData(data){
	let combineObjects = (arr, obj) => arr.map(x => Object.assign(obj, x))
	let obj = {}
	let a = {}
	combineObjects(data, obj)
	a[this.marketName] = obj
	return a
}

exports.options =
{
	marketName: 'BINANCE',
	baseURL: 'https://api.binance.com/api/v1',
	urlPath: ['/depth?limit=10&symbol=', ''],
	pairs: pairs,
	maxConcurrentRequests: 20,
	formatData: formatData
}
