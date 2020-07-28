"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSpecialChars = exports.wrapDataInObjectWithMarketName = exports.mapDataToObject = void 0;
function mapDataToObject(data) {
    var objectWithCombinedData = {};
    // @ts-ignore
    return data.map(function (sourceOfData) { return Object.assign(objectWithCombinedData, sourceOfData); })[0];
}
exports.mapDataToObject = mapDataToObject;
function wrapDataInObjectWithMarketName(data, marketName) {
    var wrapper = {};
    wrapper[marketName] = data;
    return wrapper;
}
exports.wrapDataInObjectWithMarketName = wrapDataInObjectWithMarketName;
function removeSpecialChars(obj) {
    var newObject = {};
    Object.keys(obj).forEach(function (key) {
        var newKey = key.replace(/[^A-Z]/g, "");
        newObject[newKey] = obj[key];
    });
    return newObject;
}
exports.removeSpecialChars = removeSpecialChars;
