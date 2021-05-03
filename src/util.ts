interface LunoAskOrBid {
  price: number;
  volume: number;
}

function mapDataToObject (data: object[]): object {
  let objectWithCombinedData = {}
  return data.map((sourceOfData) =>
    // issue with Object.assign -> solution
    // https://stackoverflow.com/questions/35959372/property-assign-does-not-exist-on-type-objectconstructor
    Object.assign(objectWithCombinedData, sourceOfData),
  )[0]
}

function wrapDataInObjectWithMarketName (data: object, marketName: string) {
  let wrapper = {}
  wrapper[marketName] = data
  return wrapper
}

function removeSpecialChars (obj: object): object {
  let newObject = {}

  Object.keys(obj).forEach((key) => {
    let newKey = key.replace(/[^A-Z]/g, '')
    newObject[newKey] = obj[key]
  })
  return newObject
}

function updateObjectKeys (
  data: object,
  toBeReplaced: string,
  toBeReplacedWith: string,
): object {
  Object.keys(data).forEach((currencyPair) => {
    let newKey = currencyPair.replace(toBeReplaced, toBeReplacedWith)
    data[newKey] = data[currencyPair]
    delete data[currencyPair]
  })
  return data
}

//swap objects with arrays that hold
function moveDataFromObjectToArray (data: object) {
  if (!data) return null

  //keys = asks/bids
  Object.keys(data).forEach((askOrBid) => {
    let arr = []
    //iterate over asks/bids elements
    data[askOrBid].forEach((key: LunoAskOrBid) => {
      arr.push([key['price'], key['volume']])
    })
    //replace object[ask/bid] with an array of results
    data[askOrBid] = arr
    arr = []
  })

  return data
}

function convertObjectToArray (data: object) {
  if (!data) return null

  let formattedData = {}
  Object.keys(data).forEach((currencyPair: string) => {
    formattedData[currencyPair] = moveDataFromObjectToArray(data[currencyPair])
  })
  return formattedData
}

export {
  mapDataToObject,
  wrapDataInObjectWithMarketName,
  removeSpecialChars,
  updateObjectKeys,
  moveDataFromObjectToArray,
  convertObjectToArray,
}
