const luno = require('./luno.js')
const binance = require('./binance.js')
const gdax = require('./gdax.js')
const marketService = require('./marketService.js')
const util = require('./util')
const graphService = require('./graph-service.js')

let lunoPrices = marketService.getPrices(luno.options)
let gdaxPrices = marketService.getPrices(gdax.options)
let binancePrices = marketService.getPrices(binance.options)

Promise.all([lunoPrices, gdaxPrices, binancePrices])
    .then(data => util.mapDataToObject(data))
    .then(data => { console.log(' MAIN \n' + JSON.stringify(data)); return data })
    // .then(data => graphService.buildGraph(data))
    .catch(e => console.log('error from main pricess ALL.Promise: ' + e.stack))

