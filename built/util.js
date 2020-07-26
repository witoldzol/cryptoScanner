exports.mapDataToObject = function (data) {
    var objectWithCombinedData = {};
    return data.map(function (sourceOfData) { return Object.assign(objectWithCombinedData, sourceOfData); })[0];
};
exports.wrapDataInObjectWithMarketName = function (data, marketName) {
    var wrapper = {};
    wrapper[marketName] = data;
    return wrapper;
};
