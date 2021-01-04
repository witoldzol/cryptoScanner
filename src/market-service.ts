import { MarketOptions } from './models/MarketOptions'
import async = require('async')
import axios = require('axios')

// we have to query prices of each currency pair separately with a unique url
function generateUrl (currencyPair: string, options: MarketOptions): string {
  let firstPartOfUrl = options.urlPath[0]
  let secondPartOfUrl = options.urlPath[1]
  return firstPartOfUrl + currencyPair + secondPartOfUrl
}

function selectFirst10Prices (pair: string, response: object): object {
  let asks = response['data']['asks'].slice(0, 1)
  let bids = response['data']['asks'].slice(0, 1)

  if (asks.length == 0 || bids.length == 0) {
    return null
  }
  let obj = {}
  obj[pair] = { asks, bids }
  return obj
}

function getAxios (options: MarketOptions) {
  // @ts-ignore
  return axios.create({
    baseURL: options.baseURL,
    timeout: 5000,
  })
}

function fetchPrices (options: MarketOptions): Function {
  const axios = getAxios(options)

  return async function (pair: string) {
    let url = generateUrl(pair, options)
    let tries = 1
    let response = null

    try {
      response = await axios.get(url)
    } catch (err) {
      if (tries <= 3) {
        tries++
        // re-try query with an exponential backoff
        response = setTimeout(await axios.get(url), tries * 2000)
      } else return err
    }
    // todo: refactor it out of here
    return selectFirst10Prices(pair, response)
  }
}

async function getPrices (options: MarketOptions) {
  const fetchPricesWithOptions = fetchPrices(options)

  //last arg must be a promise, that's why async is used
  return await async.mapLimit(
    options.pairs,
    options.maxConcurrentRequests,
    // async doesn't play nice with typescript -> use asyncify to make it work
    // https://stackoverflow.com/questions/45572743/how-to-enable-async-maplimit-to-work-with-typescript-async-await
    async.asyncify(async (pair: string) => fetchPricesWithOptions(pair)),
  ).then((data: object) => options.formatData(data))
}

export { getPrices }
