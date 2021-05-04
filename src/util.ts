import { CurrencyPair, MarketData } from './models/MarketData'

interface LunoAskOrBid {
  price: number;
  volume: number;
}

function isValidTicker (ticker: CurrencyPair): boolean {
  let symbol = Object.keys(ticker)[0]
  return symbol.length === 6
}

function mapDataToObject (data): MarketData {
  let combinedData = {}
  data.forEach(ticker => {
    let newTicker = removeSpecialChars(ticker)
    isValidTicker(newTicker)
    Object.assign(combinedData, newTicker)
  })
  return combinedData
}

function wrapDataInObjectWithMarketName (data: object, marketName: string) {
  let wrapper = {}
  wrapper[marketName] = data
  return wrapper
}

function removeSpecialCharsFromString (input: string) {
  return input.replace(/[^a-zA-Z ]/g, '')
}

function removeSpecialChars (input: CurrencyPair): CurrencyPair {
  let result = {}
  let originalSymbol = Object.keys(input)[0]
  let value = input[originalSymbol]
  let symbol = removeSpecialCharsFromString(Object.keys(input)[0])
  result[symbol] = value
  return result
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
