// ======================================== ALGO ==============================
function bellmanFord(source, destination) {
    if (source === void 0) { source = 'rot'; }
    if (destination === void 0) { destination = 'BTC'; }
    var getCurrency1 = function (pair) { return pair.substring(0, 3); };
    var getCurrency2 = function (pair) { return pair.substring(3, 7); };
    //upper bounds for shortest path weight from source
    var d = {};
    //predecessors
    var p = {};
    //start of algorithm
    function initializeSingleSource() {
        nodes().forEach(function (node) {
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
    function relaxAllEdges() {
        //loop N-1 times ( n = node)
        var iterations = nodes.length - 1;
        for (var i = 0; i < iterations; i++) {
            Object.keys(edges)
                .forEach(function (edge) {
                var currency1 = getCurrency1(edge);
                var currency2 = getCurrency2(edge);
                relax(currency1, currency2);
            });
        }
    }
    function relax(u, v) {
        var w = getEdgeWeight(u, v)[0];
        if (d[v] > d[u] + w) {
            d[v] = d[u] + w;
            p[v] = u;
        }
    }
    //check if negative cycle ( arbitrage opportunity ) exists in current graph
    function testForNegativeCycle() {
        var arbitrage = false;
        var cyclic = {};
        Object.keys(edges)
            .forEach(function (edge) {
            var w = getEdgeWeight(u, v)[0];
            currency1 = getCurrency1(edge);
            currency2 = getCurrency2(edge);
            if (d[currency2] > d[currency1] + w) {
                arbitrage = true;
                d[currency2] = d[currency1] + w;
                cyclic[currency2] = true;
            }
        });
        if (!arbitrage) {
            cl('NO ARBITRAGE OPPORTUNITY FOUND :<');
        }
        return cyclic;
    }
    function runBellmanFord() {
        initializeSingleSource();
        relaxAllEdges();
        return testForNegativeCycle();
    }
    return runBellmanFord();
}
