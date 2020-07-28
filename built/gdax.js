"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
var util = require("./util");
// const pairs: string[] = [ 'BCH-BTC','BCH-USD','BTC-EUR','BTC-GBP','BTC-USD','ETH-BTC','ETH-EUR','ETH-USD','LTC-BTC','LTC-EUR','LTC-USD','BCH-EUR']
var pairs = ['ETH-BTC', 'BCH-USD'];
function removeSpecialChars(obj) {
    var newObject = {};
    Object.keys(obj).forEach(function (key) {
        var newKey = key.replace(/[^A-Z]/g, "");
        newObject[newKey] = obj[key];
    });
    return newObject;
}
function formatData(data) {
    var combinedData = util.mapDataToObject(data);
    combinedData = removeSpecialChars(combinedData);
    return util.wrapDataInObjectWithMarketName(combinedData, this.marketName);
}
var options = {
    marketName: 'GDAX',
    baseURL: 'https://api.pro.coinbase.com',
    urlPath: ['/products/', '/book?level=2'],
    pairs: pairs,
    maxConcurrentRequests: 4,
    formatData: formatData
};
exports.options = options;
