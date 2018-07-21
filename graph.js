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

let createEdges = (graph, pair, values)=>
{
    //create edge with PAIR1,PAIR2,PROPERTIES [amount,volume,market name]
    //you are buying pair2 with pair 1 => use asks 
    graph.addEdge(pairOne(pair), pairTwo(pair), getValues( getAsks(values) ))
    //you are buying p1 with p2 ==> use bids
    graph.addEdge(pairTwo(pair), pairOne(pair), getValues( getBids(values) ))
}

//combine price, volume, and market name into one array
//we create new array because some markets have varied array format
//its easier to get what we need rather than fix data format of each market
let getValues = (values, market)=>
    {
	return [values[0],values[1],market]
    }

//take first element of array (it has price, volume)
let getAsks = data=>data['asks'][0]
let getBids = data=>data['bids'][0]

//----------------------------------------------------- build graph function / iterator

// let g = data=>
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
							  createEdges( g,pair,data[x][pair] )
						      })
		     })
	cl(g.topologicalSort())
	cl(g.serialize())
	// return g
    }





/*
//or traverse the whole tree ONCE ! and update graph as you go!
                // 9 - go to 'ASKS'
                    // 10 - when in asks select first item
                    // 11 - insertEdge( node 1, node 2, firstItem (lowest ask), market name)
                        // 12 = IF edge (node 1, node 2) exists, check value, if NEW edge is HIGHER, replace old with new
                // 13 - go to 'BIDS'
                    // 14 - when in bids, select first item
                    // 15 - insert edge ( NODE 2, NODE 1, ONE OVER first ITEM (highest bid) , marketName ) !!!! (REVERSE)  and  1/price  !!!!!
                        // 16 - IF EDGE exists, check value , if its lower, replace with new value ( remember values are 1/ over so 1/4000 is HIGHER than 1/5000)

Object.keys(data).forEach(x=>cl(x))

*/
