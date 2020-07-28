
function mapDataToObject(data: object[]) {
    let objectWithCombinedData = {}
    // @ts-ignore
    return data.map(sourceOfData => Object.assign(objectWithCombinedData, sourceOfData))[0]
}

function wrapDataInObjectWithMarketName(data: object, marketName: string) {
    let wrapper = {}
    wrapper[marketName] = data
    return wrapper
}

function removeSpecialChars(obj: object): object {
    let newObject = {}

    Object.keys(obj).forEach(key => {
        let newKey = key.replace(/[^A-Z]/g, "")
        newObject[newKey] = obj[key]
    })
    return newObject
}

export { mapDataToObject, wrapDataInObjectWithMarketName, removeSpecialChars }