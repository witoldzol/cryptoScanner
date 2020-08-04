// import graph = require('graph-data-structure')
import graph = require('../src/graph-structure')
import { AsksBids, MarketRates, MarketData } from './models/MarketData'

// transaction rates for all markets
const MARKET_TRANSACTION_RATES: MarketRates =
{
	luno: 1,
	binance: 0.1,
	gdax: 0.5
}

//adjusts rates by applying transaction cost specific for given market
let transactionCostAdjustment = (currencyRate: number, MARKET_TRANSACTION_RATES: object, market: string, transaction: string): number => {
	if (transaction === 'ask') {
		//increase the rate of the asset, which makes it less attrative
		return currencyRate * (1 + MARKET_TRANSACTION_RATES[market] / 100)
	}
	else if (transaction === 'bid') {
		//decrease the max rate at which people will pay for our asset
		return currencyRate * (1 - MARKET_TRANSACTION_RATES[market] / 100)
	}
}

//---------- UTILITY FUNCTIONS
let pairOne = (pair: string): string => pair.substring(0, 3)
let pairTwo = (pair: string): string => pair.substring(3, 7)

//take first element of array (it has price, volume)
//in case of asks we divide 1 over the rate to get actual rate
//for example ETH/BTC ask = 0.05 means that market sells 1 eth for 0.05 btc (graph : ETH-->BTC)
// bid will be 0.049 meaning market will buy(pay) 1/0.49 = 20.4 eth for 1 btc (graph BTC-->ETH )
let getOneOverValue = (value: number): number => 1 / value
// first value in array is the rate, second is volume
let calculateAskRate = (firstElementFromAsksArray: number[]): number[] => {
	firstElementFromAsksArray[0] = getOneOverValue(firstElementFromAsksArray[0])
	return firstElementFromAsksArray
}

// we take edge values into account only, perhaps average over first 10 values would be more prudent
let getAsksFirstElement = (data: AsksBids): number[] => calculateAskRate(data['asks'][0])
let getBidsFirstElement = (data: AsksBids): number[] => data['bids'][0]
let valueToLog = (value: number) => Math.log(value)
let valueToNegative = (value: number) => value * (-1)

//combine price, volume, and market name into one array
// sets weights in an array that will be stored in the edge
let calculateEdgeValues = (arrWithPriceAndVolume: number[], marketName: string, askOrBid: string) => {
	//holds negative log of first rate, volume, market name, type of transaction
	let edgeValues: (string | number | number[])[] = []
	let adjustedRateForMarketFee: number = transactionCostAdjustment(arrWithPriceAndVolume[0], MARKET_TRANSACTION_RATES, marketName, askOrBid)
	let normalisedRate = valueToNegative(valueToLog(adjustedRateForMarketFee))
	let volume = arrWithPriceAndVolume[1]

	// TODO: verify the order and if we need both normalisedRate && adjustedRateForMarketFee
	edgeValues[0] = normalisedRate
	edgeValues[1] = [adjustedRateForMarketFee, volume]
	edgeValues[2] = marketName
	edgeValues[3] = askOrBid
	return edgeValues

}

let createEdges = (graph, pair: string, values: AsksBids, marketName: string): void => {
	//create edge with PAIR1,PAIR2,PROPERTIES [amount,volume,market name]
	//BID - we sell pair 1
	graph.addEdge(pairOne(pair), pairTwo(pair), calculateEdgeValues(getBidsFirstElement(values), marketName, 'bid'))
	//ASK - we buy 
	graph.addEdge(pairTwo(pair), pairOne(pair), calculateEdgeValues(getAsksFirstElement(values), marketName, 'ask'))
}

// add root node to graph
// it has distance = 0 to all other nodes
// necessary for bellman-ford algo to work 
// we are looking for cycles ie. paths that start & end at the same node = root
let addRoot = graph => {
	graph.topologicalSort().map((currencyNode: string) => {
		graph.addEdge('ROOT_NODE', currencyNode, [0, 0, 'ROOT_NODE', 'ask'])
	})

}

function buildGraph(data: MarketData) {
	//create graph
	let GRAPH = graph()
	Object.keys(data)
		.forEach((marketName: string) => {
			//iterate over currencies in the market
			Object.keys(data[marketName]).forEach((pair: string) => {
				createEdges(GRAPH, pair, data[marketName][pair], marketName)
			})
		})

	addRoot(GRAPH)
	return GRAPH.bellmanFord()
}

export { buildGraph }

