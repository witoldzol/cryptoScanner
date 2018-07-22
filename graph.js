// ============================================================ GRAPH ==============================
const graph = require('graph-data-structure')    
let cl = x=>console.log(x)


// TO DO

// GRAPH PACKAGE:
// 1 -- if edge exists already, check the price - if lower / higher , update the  properties 
// 2 -- change the dikstras algorith to take value from properties array
// 3 -- when serializing / outputing string, take market name from properties & display in topographic printout of the graph




//---------- UTILITY FUNCTIONS
let pairOne = pair=>pair.substring(0,3)
let pairTwo = pair=>pair.substring(3,7)

//take first element of array (it has price, volume)
let getAsks = data=>data['asks'][0]
let getBids = data=>data['bids'][0]

//combine price, volume, and market name into one array
//we create new array because some markets have varied array format
//its easier to get what we need rather than fix data format of each market
//transaction  = bid or ask
let getValues = (values, market, transaction)=>
    {
	return [values[0],values[1], market, transaction]
    }

let createEdges = (graph, pair, values, marketName)=>
{
    //create edge with PAIR1,PAIR2,PROPERTIES [amount,volume,market name]
    //BID - we sell pair 1
    graph.addEdge(pairOne(pair), pairTwo(pair), getValues( getBids(values), marketName, 'bid' ))
    //ASK - we buy pair 1
    graph.addEdge(pairTwo(pair), pairOne(pair), getValues( getAsks(values), marketName, 'ask' ))
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
	cl(g.topologicalSort())
	cl(g.serialize())
	cl('weight of btc => eth' + g.getEdgeWeight('BTC','ETH') )
	// return g
    }
