var util = require('./util.js');
var pairs = ['XBTIDR', 'XBTMYR', 'XBTNGN', 'XBTZAR', 'ETHXBT'];
// luno refers to BTC as XBT, rename for uniformity ( this value will be used in graph)
var replaceXBT = function (x) {
    Object.keys(x).forEach(function (y) {
        var newKey = y.replace('XBT', 'BTC');
        x[newKey] = x[y];
        delete x[y];
    });
};
function formatData(data) {
    var combineObjects = function (arr, obj) { return arr.map(function (x) { return Object.assign(obj, x); }); };
    var a = {};
    var obj = {};
    combineObjects(data, obj);
    a[this.marketName] = obj;
    //get all currencies
    var l = a[this.marketName];
    //replce XBT with BTC code (they are interchangeable)
    //swap objects with arrays that hold
    var objectToArray = function (obj) {
        //keys = asks/bids
        Object.keys(obj)
            .forEach(function (x) {
            var arr = [];
            //iterate over asks/bids elements
            obj[x].forEach(function (y) {
                var a = [y['price'], y['volume']];
                arr.push(a);
            });
            //replace object[ask/bid] with an array of results
            obj[x] = arr;
            arr = [];
        });
    };
    //keys = pairs
    Object.keys(l).forEach(function (x) { return objectToArray(l[x]); });
    replaceXBT(a[this.marketName]);
    return a;
}
exports.options =
    {
        marketName: 'LUNO',
        baseURL: 'https://api.mybitx.com/api/1',
        urlPath: ['/orderbook?pair=', ''],
        pairs: pairs,
        maxConcurrentRequests: 2,
        formatData: formatData
    };
