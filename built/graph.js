// ============================================================ GRAPH ==============================
var graph = require('graph-data-structure');
// transaction rates for all markets
var allMarketRates = {
    luno: 1,
    binance: 0.1,
    gdax: 0.3
};
//adjusts rates by applying transaction cost specific for given market 
var transactionCostAdjustment = function (currencyRate, allMarketRates, market, transaction) {
    if (transaction === 'ask') {
        //increase the rate of the asset, which makes it less attrative
        return currencyRate * (1 + allMarketRates[market] / 100);
    }
    else if (transaction === 'bid') {
        //decrease the max rate at which people will pay for our asset
        return currencyRate * (1 - allMarketRates[market] / 100);
    }
    return "transaction type not specified";
};
//---------- UTILITY FUNCTIONS
var pairOne = function (pair) { return pair.substring(0, 3); };
var pairTwo = function (pair) { return pair.substring(3, 7); };
//take first element of array (it has price, volume)
//in case of asks we divide 1 over the rate to get acutal rate
//for example ETH/BTC ask = 0.05 means that market sells 1 eth for 0.05 btc (graph : ETH-->BTC)
// bid will be 0.049 meaning market will buy(pay) 1/0.49 = 20.4 eth for 1 btc (graph BTC-->ETH )
var oneOver = function (x) { return 1 / x; };
var calculateAskRate = function (arr) {
    var a = arr[0];
    var ar = arr;
    ar[0] = oneOver(a);
    return ar;
};
var getAsks = function (data) { return calculateAskRate(data['asks'][0]); };
var getBids = function (data) { return data['bids'][0]; };
var toLog = function (x) { return Math.log(x); };
var toNegative = function (x) { return x * (-1); };
//combine price, volume, and market name into one array
//we create new array because some markets have varied array format
//its easier to get what we need rather than fix data format of each market
//transaction  = bid or ask
var setWeights = function (values, market, transaction, pair) {
    // sets weights in an array that will be stored in the edge
    //holds negative log of first rate, volume, market name, type of transaction
    var arr = [];
    var adjustedRate = transactionCostAdjustment(values[0], allMarketRates, market, transaction);
    arr[0] = toNegative(toLog(adjustedRate));
    arr[1] = [adjustedRate, values[1]];
    arr[2] = market;
    arr[3] = transaction;
    // return [toNegative (  toLog ( transactionCostAdjustment( values[0], allMarketRates, market, transaction ) ) ), values[1], market, transaction ]
    return arr;
};
var createEdges = function (graph, pair, values, marketName, allValues) {
    //create edge with PAIR1,PAIR2,PROPERTIES [amount,volume,market name]
    //BID - we sell pair 1
    //GRAPH REPRESENTATION :    CURR1 ====== > CURR2
    graph.addEdge(pairOne(pair), pairTwo(pair), setWeights(getBids(values), marketName, 'bid', pair));
    //ASK - we buy pair 1
    graph.addEdge(pairTwo(pair), pairOne(pair), setWeights(getAsks(values), marketName, 'ask', pair));
};
var addRoot = function (graph) {
    graph.topologicalSort().map(function (x) {
        graph.addEdge('rot', x, [0, 0, 'rot', 'ask']);
    });
};
//----------------------------------------------------- build graph function / iterator
exports.buildGraph = function (data) {
    //create graph
    var g = graph();
    // 1 - go to each market
    Object.keys(data)
        .forEach(function (x) {
        var marketName = x;
        // 2 - when in market -
        //iterate over currencies in the market
        Object.keys(data[x]).forEach(function (pair) {
            createEdges(g, pair, data[x][pair], marketName);
        });
    });
    //add ROOT node with zero weight edges to ALL other nodes
    //list all nodes / array /
    addRoot(g);
    //return results
    return g.bellmanFord();
    // return g.serialize()
};
