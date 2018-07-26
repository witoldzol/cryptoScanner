const fs = require('fs')

// A graph data structure with depth-first search and topological sort.
module.exports = function Graph(serialized){

    let cl = x=>console.log(x)
    
    // The returned graph instance.
    var graph = {
	addNode: addNode,
	removeNode: removeNode,
	nodes: nodes,
	adjacent: adjacent,
	addEdge: addEdge,
	removeEdge: removeEdge,
	setEdgeWeight: setEdgeWeight,
	getEdgeWeight: getEdgeWeight,
	indegree: indegree,
	outdegree: outdegree,
	depthFirstSearch: depthFirstSearch,
	topologicalSort: topologicalSort,
	shortestPath: shortestPath,
	bellmanFord: bellmanFord,
	serialize: serialize,
	deserialize: deserialize,
	getAllElements: getAllElements
    };

    // The adjacency list of the graph.
    // Keys are node ids.
    // Values are adjacent node id arrays.
    var edges = {};
    
    // The weights of edges.
    // Keys are string encodings of edges.
    // Values are weights (numbers).
    var edgeWeights = {};

    //stores all edges
    //we create it to avoid using serialize function
    let allEdges = []
    
    // If a serialized graph was passed into the constructor, deserialize it.
    if(serialized){
	deserialize(serialized);
    }

    // Adds a node to the graph.
    // If node was already added, this function does nothing.
    // If node was not already added, this function sets up an empty adjacency list.
    function addNode(node){
	edges[node] = adjacent(node);
	return graph;
    }

    // Removes a node from the graph.
    // Also removes incoming and outgoing edges.
    function removeNode(node){
	
	// Remove incoming edges.
	Object.keys(edges).forEach(function (u){
	    edges[u].forEach(function (v){
		if(v === node){
		    removeEdge(u, v);
		}
	    });
	});

	// Remove outgoing edges (and signal that the node no longer exists).
	delete edges[node];

	return graph;
    }

    // Gets the list of nodes that have been added to the graph.
    function nodes(){
	var nodeSet = {};
	Object.keys(edges).forEach(function (u){
	    nodeSet[u] = true;
	    edges[u].forEach(function (v){
		nodeSet[v] = true;
	    });
	});
	return Object.keys(nodeSet);
    }

    // Gets the adjacent node list for the given node.
    // Returns an empty array for unknown nodes.
    function adjacent(node){
	return edges[node] || [];
    }

    // Computes a string encoding of an edge,
    // for use as a key in an object.
    function encodeEdge(u, v){
	// return u + "|" + v;
	return u + v;
    }

    // Sets the weight of the given edge.
    function setEdgeWeight(u, v, weight){

	edgeWeights[encodeEdge(u, v)] = weight;

	return graph;
    }

    // Gets the weight of the given edge.
    // Returns 1 if no weight was previously set.
    function getEdgeWeight(u, v){
	// var weight = edgeWeights[encodeEdge(u, v)];
	var weight = edgeWeights[encodeEdge(u, v)];
	return weight === undefined ? 0 : weight;
    }

    //checks if the edge between nodes exists
    //returns boolean
    function checkIfEdgeExists(u,v){
	let result = false
	adjacent(u).forEach(x=>{
	    if(v==x)result = true
	})
	return result
    }

    //returns fourth element from the weights array 
    let transactionType = weight=>weight[3]
    
    //if edge already exists, compares weights,
    //and updates it if new value is more beneficial
    function updateWeight(u,v,weight){

	let oldPrice = getEdgeWeight(u,v)[0]
	let newPrice = weight[0]
	console.log('old price ' + oldPrice)
	console.log('new price ' + newPrice)
	
	if ( transactionType(weight) == 'ask' )
	{
	    //if operation is buy we have to select lowest ASK price
	    //but we calculate NEGATIVE logarithm of the price
	    //so we pick HIGHER as better price (because we will look for negative cycles)
	    if(newPrice > oldPrice)
	    {
		setEdgeWeight(u, v, weight)
		console.log(u + ' ===> ' + v + '  rate:  ' + newPrice)
		console.log('ASK price has been updated from ' + oldPrice + ' to ' + newPrice )
	    }

	}
	else if ( transactionType(weight) == 'bid')
	{
	    //if operation is SELL we have to select HIGHEST BID pric
	    //but we calculate NEGATIVE logarithm of the price
	    //so we pick LOWER as better price (because we will look for negative cycles)
	    if(newPrice < oldPrice)
	    {
		setEdgeWeight(u, v, weight)
		console.log(u + ' ===> ' + v + '  rate:  ' + newPrice)
		console.log('BID price has been updated from ' + oldPrice + ' to ' + newPrice )
	    }
	}
    }

    
    // Adds an edge from node u to node v.
    // Implicitly adds the nodes if they were not already added.
    function addEdge(u, v, weight){
	addNode(u);
	addNode(v);
	
	//if edge exists -- check if we need to update
	if(edges[u] && checkIfEdgeExists(u,v))
	{
	    updateWeight(u,v,weight)
	}
	else
	{
	    //record edge as adjencent
	    adjacent(u).push(v);
	    //add edge to array -- TEST
	    allEdges.push(u+v)

	    if (weight !== undefined) {
		setEdgeWeight(u, v, weight)
	    } else {
		console.log('THIS EDGE HAS NO WEIGHT ' + (u+v) )
	    }
	}
	return graph;
    }

    // Removes the edge from node u to node v.
    // Does not remove the nodes.
    // Does nothing if the edge does not exist.
    function removeEdge(u, v){
	if(edges[u]){
	    edges[u] = adjacent(u).filter(function (_v){
		return _v !== v;
	    });
	}
	return graph;
    }

    // Computes the indegree for the given node.
    // Not very efficient, costs O(E) where E = number of edges.
    function indegree(node){
	var degree = 0;
	function check(v){
	    if(v === node){
		degree++;
	    }
	}
	Object.keys(edges).forEach(function (u){
	    edges[u].forEach(check);
	});
	return degree;
    }

    // Computes the outdegree for the given node.
    function outdegree(node){
	return node in edges ? edges[node].length : 0;
    }

    // Depth First Search algorithm, inspired by
    // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 604
    // This variant includes an additional option 
    // `includeSourceNodes` to specify whether to include or
    // exclude the source nodes from the result (true by default).
    // If `sourceNodes` is not specified, all nodes in the graph
    // are used as source nodes.
    function depthFirstSearch(sourceNodes, includeSourceNodes){

	if(!sourceNodes){
	    sourceNodes = nodes();
	}

	if(typeof includeSourceNodes !== "boolean"){
	    includeSourceNodes = true;
	}

	var visited = {};
	var nodeList = [];

	function DFSVisit(node){
	    if(!visited[node]){
		visited[node] = true;
		adjacent(node).forEach(DFSVisit);
		nodeList.push(node);
	    }
	}

	if(includeSourceNodes){
	    sourceNodes.forEach(DFSVisit);
	} else {
	    sourceNodes.forEach(function (node){
		visited[node] = true;
	    });
	    sourceNodes.forEach(function (node){
		adjacent(node).forEach(DFSVisit);
	    });
	}

	return nodeList;
    }

    // The topological sort algorithm yields a list of visited nodes
    // such that for each visited edge (u, v), u comes before v in the list.
    // Amazingly, this comes from just reversing the result from depth first search.
    // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 613
    function topologicalSort(sourceNodes, includeSourceNodes){
	return depthFirstSearch(sourceNodes, includeSourceNodes).reverse();
    }

    // Dijkstra's Shortest Path Algorithm.
    // Cormen et al. "Introduction to Algorithms" 3rd Ed. p. 658
    // Variable and function names correspond to names in the book.
    function shortestPath(source, destination){

	// Upper bounds for shortest path weights from source.
	var d = {};

	// Predecessors.
	var p = {};

	// Poor man's priority queue, keyed on d.
	var q = {};

	function initializeSingleSource(){
	    nodes().forEach(function (node){
		d[node] = Infinity;
	    });
	    if (d[source] !== Infinity) {
		throw new Error("Source node is not in the graph");
	    }
	    if (d[destination] !== Infinity) {
		throw new Error("Destination node is not in the graph");
	    }
	    d[source] = 0;
	}

	// Adds entries in q for all nodes.
	function initializePriorityQueue(){
	    nodes().forEach(function (node){
		q[node] = true;
	    });
	}

	// Returns true if q is empty.
	function priorityQueueEmpty(){
	    return Object.keys(q).length === 0;
	}

	// Linear search to extract (find and remove) min from q.
	function extractMin(){
	    var min = Infinity;
	    var minNode;
	    Object.keys(q).forEach(function(node){
		if (d[node] < min) {
		    min = d[node];
		    minNode = node;
		}
	    });
	    if (minNode === undefined) {
		// If we reach here, there's a disconnected subgraph, and we're done.
		q = {};
		return null;
	    }
	    delete q[minNode];
	    return minNode;
	}

	function relax(u, v){
	    var w = getEdgeWeight(u, v);
	    if (d[v] > d[u] + w) {
		d[v] = d[u] + w;
		p[v] = u;
	    }
	}

	function dijkstra(){
	    initializeSingleSource();
	    initializePriorityQueue();
	    while(!priorityQueueEmpty()){
		var u = extractMin();
		adjacent(u).forEach(function (v){
		    relax(u, v);
		});
	    }
	}

	// Assembles the shortest path by traversing the
	// predecessor subgraph from destination to source.
	function path(){
	    var nodeList = [];
	    var weight = 0;
	    var node = destination;
	    while(p[node]){
		nodeList.push(node);
		weight += getEdgeWeight(p[node], node);
		node = p[node];
	    }
	    if (node !== source) {
		throw new Error("No path found");
	    }
	    nodeList.push(node);
	    nodeList.reverse();
	    nodeList.weight = weight;
	    return nodeList;
	}

	dijkstra();

	return path();
    }

    // Serializes the graph.
    function serialize(){
	var serialized = {
	    nodes: nodes().map(function (id){
		return { id: id };
	    }),
	    links: []
	};

	serialized.nodes.forEach(function (node){
	    var source = node.id;
	    adjacent(source).forEach(function (target){
		serialized.links.push({
		    source: source,
		    target: target,
		    weight: getEdgeWeight(source, target)
		});
	    });
	});

	return serialized;
    }
    
    // Gets all nodes & edges with weights
    function getAllElements(){
	let  serialized = {
	    nodes: nodes().map(function (id){
		return { id: id };
	    }),
	    links: []
	};

	serialized.nodes.forEach(function (node){
	    let source = node.id;
	    adjacent(source).forEach(function (target){
		serialized.links.push([
		    source+target,getEdgeWeight(source, target)[0]
		]);
	    });
	});
	return serialized

    }
    
    // Deserializes the given serialized graph.
    function deserialize(serialized){
	serialized.nodes.forEach(function (node){ addNode(node.id); });
	serialized.links.forEach(function (link){ addEdge(link.source, link.target, link.weight); });
	return graph;
    }

    // ======================================== ALGO ==============================
    const getCurrency1 = pair=>pair.substring(0,3)
    const getCurrency2 = pair=>pair.substring(3,7)

    function  bellmanFord()
	{
	    //upper bounds for shortest path weight from source
	    let d = {}
	    //predecessors
	    let p = {}
	    //source ==> starting point of every calculation
	    let source = 'rot'
	    
	    //start of algorithm
	    function initializeSingleSource(){
		nodes().forEach(function (node){
		    d[node] = Infinity;
		});
		if (d[source] !== Infinity) {
		    throw new Error("Source node is not in the graph");
		}
		d[source] = 0;
	    }

	    function relaxAllEdges()
	    {
		//loop N-1 times ( n = node)
		let iterations = nodes().length -1
		for (var i = 0; i < iterations; i++) {

			allEdges.map(edge=>
				 {
				     let currency1= getCurrency1(edge)
				     let currency2= getCurrency2(edge)
				     relax(currency1,currency2)
				 })
		}
	    }

	    function relax(u, v){
		var w = getEdgeWeight(u, v)[0]
		if (d[v] > d[u] + w) {
		    d[v] = d[u] + w;
		    // cl(u)
		    // cl(v)
		    p[v] = u;
		}
	    }
	    
	    //check if negative cycle ( arbitrage opportunity ) exists in current graph
	    function testForNegativeCycle()
	    {

		let arbitrage = false
		let cyclic = {}
		//iterate over all edges and relax them
		allEdges.map(edge=>
			     {
				 let currency1= getCurrency1(edge)
				 let currency2= getCurrency2(edge)

				 let w = getEdgeWeight(currency1, currency2)[0]
				 //check if weight is ok
				 if( w === undefined ){cl('from tester of negative cycles: invalid weight obtained');cl(edge + '  ' + w); return}

				 if( d[currency2] > d[currency1] + w)
				 {
				     arbitrage = true
				     d[currency2] = d[currency1] + w
				     cyclic[currency2] = true
				 }
			     })
		if(!arbitrage){ console.log('NO ARBITRAGE OPPORTUNITY FOUND :<')}
		else { cl('cycle'); cl(cyclic); return cyclic }
	    }

	    
	    //builds (concatenates) currency pairs from cycle path
	    //takes first two and joins them, then second and third etc
	    function buildEdgesFromSequences(arr){
		let a = []
		arr.map((x,i)=>{
		    if(arr[i+1] !=x && arr[i+1]!==undefined ) {a.push(x + arr[i+1] )}
		})
		return a
	    }
	    
	    //we will need access to predecesors and array of currencies in cycle
	    function buildSequences(cyclic, prede){
		//all sequences will be stored here
		let sequences=[]
		Object.keys(cyclic)
		    .forEach(currency=>
			     {
				 let visited = {}
				 visited[currency] = true
				 //single sequence
				 let seq = []
				 let p = currency
				 //loop until p is not empty or we visited p already
				 // while(p != null && (!visited[p]) ){
				 while(p != null){
				     seq.push(p)
				     visited[p]=true
				     p = prede[p]
				     if(visited[p]){break}
				 }
				 cl('sequence before reversal')
				 cl(seq)
				 //reverse the order (first!)
				 //push first ele to the end (second)
				 //this creates cycle
				 seq.reverse().push(seq[0])
				 let cycleSequence = buildEdgesFromSequences( seq )
				 sequences.push( cycleSequence )
			     })
		cl('all dep')
		cl(prede)
		//returns array of sequences
		//sequence holds currency codes only!
		return sequences
	    }

	    //calculates arbitrage rate
	    function calculateArbitrageAmount(array){
		//gets rates from edge weights array 
		let weights = []
		
		array.map(pair=>{
		    let c1 = getCurrency1(pair)
		    let c2 = getCurrency2(pair)
		    let w = getEdgeWeight( c1, c2 )[0]

		    //test
		    //because we have directed graph, that means not every 'sequence' will be a cycle
		    //as it will not 'close'
		    //if we get undefined weight, that means we have sequence that doesn't 'close'
		    //because we created edge that doesn't exist => weight = undefined
		    if( w === undefined) return 0
		    weights.push(w)
		})
		
		let reducer = (acc,curr)=>acc+curr

		let sum = weights.reduce(reducer)

		let result = Math.pow(10,sum)
		cl(result)
		return result
	    }
	    
	    function getResults (sequences){
		let results = {}
		sequences.map(arr=>{
		    let amount = calculateArbitrageAmount(arr)
		    //TODO -- ADD NAME OF MARKET 
		    results[amount]=arr
		})

		return results
	    }

	    function sortObject(obj){
		let sortedObject ={}
		let amountsArray =[]

		Object.keys(obj)
		    .forEach(amount=>amountsArray.push(amount))

		let sortedArray = amountsArray.sort()	
		sortedArray.map(amount=>{
		    sortedObject[amount] = obj[amount]
		})

		return sortedObject
	    }
	    
	    function runBellmanFord(){
		initializeSingleSource();
		relaxAllEdges()
		//array of currencies that formed cycles
		let cyclic = testForNegativeCycle()
		//if we found negative cycle
		//continue process
		if(cyclic !== undefined){
		    //array of cycle sequences
		    let sequences = buildSequences(cyclic, p)
		    let results = sortObject( getResults(sequences) )
		    console.log(results)
		}
	    }

	    runBellmanFord()

	}

    
    return graph;
}
