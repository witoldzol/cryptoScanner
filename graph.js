// ============================================================ GRAPH ==============================
const graph = require('graph-data-structure')

// transaction rates for all markets
const allMarketRates = 
{
	luno:1,
	binance:0.1,
	gdax:0.3
}

//adjusts rates by applying transaction cost specific for given market 
let transactionCostAdjustment = (currencyRate, allMarketRates, market, transaction)=>
{
	if(transaction==='ask')
	{
		//increase the rate of the asset, which makes it less attrative
		return currencyRate * ( 1 + allMarketRates[market] / 100)
	}
	else if(transaction==='bid')
	{
		//decrease the max rate at which people will pay for our asset
		return currencyRate * ( 1 - allMarketRates[market] / 100)
	}
	return "transaction type not specified"
}

//---------- UTILITY FUNCTIONS
let pairOne = pair=>pair.substring(0,3)
let pairTwo = pair=>pair.substring(3,7)
let cl = x=>console.log(x)
//take first element of array (it has price, volume)
//in case of asks we divide 1 over the rate to get acutal rate
//for example ETH/BTC ask = 0.05 means that market sells 1 eth for 0.05 btc (graph : ETH-->BTC)
// bid will be 0.049 meaning market will buy(pay) 1/0.49 = 20.4 eth for 1 btc (graph BTC-->ETH )
let oneOver = x=>1/x
let calculateAskRate = arr=>
    {
	
	let a=arr[0]
	let ar = arr
	ar[0]=oneOver(a)
	return ar
    }
let getAsks = data=>calculateAskRate(data['asks'][0])
let getBids = data=>data['bids'][0]
let toLog = x=>Math.log(x)
let toNegative =x=>x*(-1)

//combine price, volume, and market name into one array
//we create new array because some markets have varied array format
//its easier to get what we need rather than fix data format of each market
//transaction  = bid or ask
let setWeights = (values, market, transaction, pair)=>
    {
	// sets weights in an array that will be stored in the edge
	//holds negative log of first rate, volume, market name, type of transaction
	let arr = []
	let adjustedRate =transactionCostAdjustment( values[0], allMarketRates, market, transaction ) 
	arr[0] = toNegative (  toLog ( adjustedRate) )
	arr[1] = [adjustedRate, values[1] ]
	arr[2] = market
	arr[3] = transaction
	// return [toNegative (  toLog ( transactionCostAdjustment( values[0], allMarketRates, market, transaction ) ) ), values[1], market, transaction ]
 	return arr

    }

let createEdges = (graph, pair, values, marketName, allValues)=>
    {
	cl('building edges')
	//create edge with PAIR1,PAIR2,PROPERTIES [amount,volume,market name]
	//BID - we sell pair 1
	//GRAPH REPRESENTATION :    CURR1 ====== > CURR2
	graph.addEdge(pairOne(pair), pairTwo(pair), setWeights( getBids(values), marketName, 'bid', pair))
	//ASK - we buy pair 1
	graph.addEdge(pairTwo(pair), pairOne(pair), setWeights( getAsks(values), marketName, 'ask', pair))

    }

let addRoot = graph=>
    {

	cl('adding root')
	graph.topologicalSort().map(x=>
				{
				    graph.addEdge('rot', x, [0,0,'rot','ask'])  
				})

    }





//----------------------------------------------------- build graph function / iterator


exports.buildGraph = data=>
    {
	//create graph
	let g = graph()
	// 1 - go to each market
	Object.keys(data)
	// iterate over markets
	    .forEach(x=>
		     {
			 let marketName = x
			 // 2 - when in market -
			 //iterate over currencies in the market
			 Object.keys(data[x]).forEach(pair=>
						      {
							  createEdges( g,pair,data[x][pair], marketName ) 
						      })
		     })

	//add ROOT node with zero weight edges to ALL other nodes
	//list all nodes / array /
	addRoot(g)
	//return results
	return g.bellmanFord()

    }
