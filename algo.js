// ============================================================ ALGO ==============================

/*
-
-build a graph using best edges
-traverse the graph and plot optimal way (highest prosfit)



makes a list of all acquired currencies (remove duplis)
push list to the queue/stack
pick one from top and 


API
--------------------
Digraph (int V) - create  empty digraph with V vertices

addEdge(int v, int w) - add a directed ecge v->w

adj(int v) vertices pointing from v

int V - number of vertices

int E - number of edges

Digraph reverse() - reverse of this digraph

String toString - string representation

// PRINT OUT EACH edge once
forEach( v in G.V )
    forEach( w : G.adj(v) )
       console.log( v + "=>" + w )


//CLASS --- 

public class Digraph
{

private final int V
private final Bag<Integer>[] adj  // adjecency list

  public Digraph(int V)  // create empty digraph with V vertices 
  {
  this.V = V
  adj = (Bag<Integer>[]) new Bag[V]
  //loop
  for(v=0; v<V; v++)
    adj[v] = new Bag<Integer>()
  }
  public void addEdge(int v, int w)
  {
  adj[v].add(w)
  }

  public Iterable<Integer> adj(int v)
  { return adj[v] }

}



const graph = require('graph-data-structure')

let cl = x=>console.log(x)

let g = graph()

 

//or traverse the whole tree ONCE ! and update graph as you go!

// 1 - go to each market

    // 2 - when in market -

        // 3 - save market name

        // 4 - go to each currency pair

            // 5 - when in currency

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

 

//once all

    //markets

        //pairs

            //bids

            //asks

 

// have been visited, graph is complete

 

Object.keys(data).forEach(x=>cl(x))

 



*/
