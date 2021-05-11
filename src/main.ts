import { lunoOptions } from './luno'
import { binanceOptions } from './binance'
import { gdaxOptions } from './gdax'
import { getPrices } from './market-service'
import { mapDataToObject } from './util'
import { GraphService } from './graph-service'
import Graph = require('../src/graph-library')
import { bitfinexOptions } from './markets/bitfinex'

let graphService = new GraphService(Graph())

let lunoPrices = getPrices(lunoOptions)
let gdaxPrices = getPrices(gdaxOptions)
let binancePrices = getPrices(binanceOptions)
let bitfinexPrices = getPrices(bitfinexOptions)

//   Promise.all([ bitfinexPrices, lunoPrices, gdaxPrices, binancePrices]).
  Promise.all([ binancePrices]).
  then(data=>console.log(data)).
//   then((data) => mapDataToObject(data)).
//   then(data =>
//     graphService.populateGraph(data).
//       recalculateEdgeWeights().
//       findNegativeCycles().
//       getArbitrageResults(),
//   ).
//   then(result => {
//     result.forEach(x => console.log(x))
//   }).
  catch((e) => console.log('error from main pricess ALL.Promise: ' + e.stack))
