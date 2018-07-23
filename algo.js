// ======================================== ALGO ==============================

let bellmanFord = (source, destination)=>
    {
	//upper bounds for shortest path weight from source
	let d = {}
	//predecessors
	let p = {}

	//start of algorithm
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

	function relax(u, v){
	    var w = getEdgeWeight(u, v)[0]
	    if (d[v] > d[u] + w) {
		d[v] = d[u] + w;
		p[v] = u;
	    }
	}

	function findNegativeCycle(){
	    initializeSingleSource();
	    
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


    }
