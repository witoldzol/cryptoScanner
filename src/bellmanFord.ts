import Graph from 'graph-data-structure'

export class MyGraph {
    private graph

    constructor(){
        this.graph = Graph()
        this.graph.testFunction = this.bellmanford
    }

    bellmanford(){
        return 'run awesome algo'
    }

}

export default MyGraph