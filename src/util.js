
exports.mapDataToObject = (data) => {
    let objectWithCombinedData = {}
    return data.map(sourceOfData => Object.assign(objectWithCombinedData, sourceOfData))[0]
}

exports.wrapDataInObjectWithMarketName = (data, marketName) => {
    let wrapper = {}
    wrapper[marketName] = data
    return wrapper
}