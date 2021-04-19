import Graph = require('../src/graph-library')
import { GraphService } from '../src/graph-service'

describe('Graph library', () => {
  let graph
  let graphService
  const data = {
    GDAX: {
      ETHBTC: {
        asks: [['0.03378', '59.59791775', 8]],
        bids: [['0.03378', '59.59791775', 8]],
      },
    },
    BINANCE: {
      ETHBTC: {
        asks: [['0.03378', '59.59791775', 8]],
        bids: [['0.03378', '59.59791775', 8]],
      },
    },
  }

  beforeEach(() => {
    graph = Graph()
    graphService = new GraphService()
    graph = graphService.populateGraph(data)
  })

  it('returns valid graph', () => {
    expect(graph.hasOwnProperty('addNode')).toBeTrue()
    expect(graph.hasOwnProperty('findNegativeCycles')).toBeTrue()
  })

  it('#findNegativeCycles returns no cycles', () => {
    const negativeCycles = graph.findNegativeCycles()
    expect(negativeCycles).toEqual([])
  })

  it('#findNegativeCycles returns negative cycles', () => {
    const data = {
      GDAX: {
        ETHBTC: {
          asks: [[1, 59.59791775, 8]],
          bids: [[0.9, 59.59791775, 8]],
        },
      },
      BINANCE: {
        ETHBTC: {
          asks: [[0.8, 59.59791775, 8]],
          bids: [[1.2, 59.59791775, 8]],
        },
      },
      LUNO: {
        ETHBTC: {
          asks: [[0.5, 59.59791775, 8]],
          bids: [[1.5, 59.59791775, 8]],
        },
      },
    }
    let graph = Graph()
    let graphService = new GraphService()
    graph = graphService.populateGraph(data)
    graph = graphService.recalculateEdgeWeights(graph)

    const negativeCycles = graph.findNegativeCycles()
    expect(negativeCycles[0]).toEqual([ 'ETH', 'BTC' ])
  })
})
