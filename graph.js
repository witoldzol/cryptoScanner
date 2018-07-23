// ============================================================ GRAPH ==============================
const graph = require('graph-data-structure')    
let cl = x=>console.log(x)

//---------- UTILITY FUNCTIONS
let pairOne = pair=>pair.substring(0,3)
let pairTwo = pair=>pair.substring(3,7)

//take first element of array (it has price, volume)
//in case of asks we divide 1 over the rate to get acutal rate
//for example ETH/BTC ask = 0.05 means that market sells 1 eth for 0.05 btc (graph : ETH-->BTC)
// bid will be 0.049 meaning market will buy(pay) 1/0.49 = 20.4 eth for 1 btc (graph BTC-->ETH )
let oneOver = x=>1/x
let replaceFirstElement = arr=>
    {
	let a=arr[0]
	arr[0]=oneOver(a)
	return arr
    }
let getAsks = data=>replaceFirstElement(data['asks'][0])
let getBids = data=>data['bids'][0]
let toLog = x=>Math.log(x)
let toNegative =x=>x*(-1)
//combine price, volume, and market name into one array
//we create new array because some markets have varied array format
//its easier to get what we need rather than fix data format of each market
//transaction  = bid or ask
let getValues = (values, market, transaction)=>
    {
	return [toNegative( toLog(values[0]) ),values[1], market, transaction]
    }

let createEdges = (graph, pair, values, marketName)=>
{
    //create edge with PAIR1,PAIR2,PROPERTIES [amount,volume,market name]
    //BID - we sell pair 1
    //GRAPH REPRESENTATION :    CURR1 ====== > CURR2
    graph.addEdge(pairOne(pair), pairTwo(pair), getValues( getBids(values), marketName, 'bid' ))
    //ASK - we buy pair 1
    graph.addEdge(pairTwo(pair), pairOne(pair), getValues( getAsks(values), marketName, 'ask' ))

}
let addRoot = graph=>
    {
	graph.topologicalSort().map(x=>
				{
				    graph.addEdge('root', x, [0,0,'root','ask'])  
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
	cl(g.serialize())
	cl('weight of btc => eth' + g.getEdgeWeight('BTC','ETH') )
	// return g
    }
