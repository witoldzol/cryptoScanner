// ============================================================ ALGO ==============================
const graph = require('graph-data-structure')    
let cl = x=>console.log(x)
let g = graph()

/*
//or traverse the whole tree ONCE ! and update graph as you go!
                // 6 - split currency pair to 2 strings
                // 6a - save both pairs in temp vars (order important)
                // 7 - createNode for each pair
                // 8 - if node exists do nothing
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

//---------- UTILITY FUNCTIONS
//when creating edges, create them going in both direction
//ISSUES; how to store the properties : market name, asks/bids price, volume at that price
//when creating properties, we need to distinguish between ASKS and BIDS

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
let getBids = data=>data['bids'][o]

//----------------------------------------------------- build graph

cl(util.obj)
// 1 - go to each market
Object.keys(obj)
// iterate over markets
.forEach(x=>
{
    let marketName = x
    // 2 - when in market -
    //iterate over currencies in the market
    Object.keys(obj[x]).forEach(pair=>
        {
            //y is a currency pair
            //we split it into two bits and feed to edge creator function
            // addEdge(pairOne(y), pairTwo(y), highestBid(obj[x][y]))
            // addEdge(pairTwo(y), pairOne(y), lowestAsk(obj[x][y]))
            //createEdges(g, pair, obj[x][pair])
            cl(pair)
        })
})




