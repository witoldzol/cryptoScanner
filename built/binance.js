var util = require('./util');
var pairsUnfiltered = ['ETHBTC', 'LTCBTC'];
// let pairsUnfiltered = ['ETHBTC','LTCBTC','BNBBTC','NEOBTC','QTUMETH','EOSETH','SNTETH','BNTETH','BCCBTC','GASBTC','BNBETH','BTCUSDT','ETHUSDT','HSRBTC','OAXETH','DNTETH','MCOETH','ICNETH','MCOBTC','WTCBTC','WTCETH','LRCBTC','LRCETH','QTUMBTC','YOYOBTC','OMGBTC','OMGETH','ZRXBTC','ZRXETH','STRATBTC','STRATETH','SNGLSBTC','SNGLSETH','BQXBTC','BQXETH','KNCBTC','KNCETH','FUNBTC','FUNETH','SNMBTC','SNMETH','NEOETH','IOTABTC','IOTAETH','LINKBTC','LINKETH','XVGBTC','XVGETH','SALTBTC','SALTETH','MDABTC','MDAETH','MTLBTC','MTLETH','SUBBTC','SUBETH','EOSBTC','SNTBTC','ETCETH','ETCBTC','MTHBTC','MTHETH','ENGBTC','ENGETH','DNTBTC','ZECBTC','ZECETH','BNTBTC','ASTBTC','ASTETH','DASHBTC']
var pairs = pairsUnfiltered.filter(function (ele) { return ele.length == 6; });
function formatData(data) {
    var combinedData = util.mapDataToObject(data);
    return util.wrapDataInObjectWithMarketName(combinedData, this.marketName);
}
exports.options =
    {
        marketName: 'BINANCE',
        baseURL: 'https://api.binance.com/api/v1',
        urlPath: ['/depth?limit=10&symbol=', ''],
        pairs: pairs,
        maxConcurrentRequests: 20,
        formatData: formatData
    };
