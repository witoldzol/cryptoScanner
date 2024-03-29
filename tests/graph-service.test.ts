import {
  GraphService,
  ResultNode,
  ArbitrageResult,
  TransactionType,
} from '../src/graph-service'
import Graph = require('../src/graph-library')
import { MarketData } from '../src/models/MarketData'

describe('GraphService', () => {
  let service

  beforeEach(() => {
    service = new GraphService(Graph())
  })

  describe('#getOneOverValue', () => {
    it('returns correct value', () => {
      let mockValue = 17
      let expectedValue = 1 / 17
      expect(service.valueToReciprocal(mockValue)).toBe(expectedValue)
    })
  })

  describe('#valueToLog', () => {
    it('returns correct value', () => {
      let mockValue = 12
      let expectedValue = Math.log(mockValue)

      expect(service.valueToNaturalLog(mockValue)).toBe(expectedValue)
    })
  })

  describe('#adjustPriceWithMarketFee', () => {
    const price = 100
    const market = 'luno'
    it('increases price by market fee when buying (asks)', () => {
      const transaction = TransactionType.ASKS
      const result = service.adjustPriceWithMarketFee(
        price,
        market,
        transaction,
      )
      expect(result).toEqual(101)
    })

    it('lowers price by market fee when selling (asks)', () => {
      const transaction = 'bids'
      const result = service.adjustPriceWithMarketFee(
        price,
        market,
        transaction,
      )
      expect(result).toEqual(99)
    })

    it('throws error when invalid market name is given', () => {
      const transaction = 'asks'
      const invalidMarket = 'gimme yo mannie'
      expect(() => {
        service.adjustPriceWithMarketFee(price, invalidMarket, transaction)
      }).toThrowError('Invalid market name')
    })

    it('throws error when invalid transaction is given', () => {
      const invalidTransaction = 'asks and you shall receive'
      expect(() => {
        service.adjustPriceWithMarketFee(price, market, invalidTransaction)
      }).toThrowError('Invalid transaction type')
    })
  })

  describe('#populateGraph', () => {
    let data
    beforeEach(() => {
      data = {
        LUNO: {
          AAABBB: {
            asks: [['17', '2']],
            bids: [['12', '3']],
          },
        },
      }
    })
    it('creates a valid graph', () => {
      service.populateGraph(data)
      expect(service.graph.nodes().length).toBe(2)
      expect(service.graph.adjacent('AAA').length).toBe(1)
    })

    it(
      '#getFirstOfferFromData throws error if transaction type is not asks or bids',
      () => {
        expect(() => {
          service.getFirstOfferFromData('bla', { asks: [[1, 1]], bids: [[2, 2]] })
        }).toThrowError('Invalid transaction type')
      })

    it('duplicate edges are not allowed', () => {
      data = {
        LUNO: {
          AAABBB: {
            asks: [['18', '2']],
            bids: [['12', '3']],
          },
        },
        BINANCE: {
          AAABBB: {
            asks: [['15', '2']],
            bids: [['13', '3']],
          },
        },
        GDAX: {
          AAABBB: {
            asks: [['15', '2']],
            bids: [['13', '3']],
          },
        },
      }

      service.populateGraph(data)
      const edges = service.graph.getEdges()
      expect(edges['AAA'].length).toBe(1)
      expect(edges['BBB'].length).toBe(1)
    })

    it('#createBidEdge replace edge if the price is better', () => {
      data = {
        LUNO: {
          AAABBB: {
            asks: [['18', '2']],
            bids: [['12', '3']],
          },
        },
        BINANCE: {
          AAABBB: {
            asks: [['15', '2']],
            bids: [['13', '3']],
          },
        },
      }

      service.populateGraph(data)
      const expectedMarketName = 'BINANCE'
      const bidEdgeMarketName = service.graph.getEdgeWeight('BBB', 'AAA')[
        'marketName'
        ]

      const askEdgeMarketName = service.graph.getEdgeWeight('AAA', 'BBB')[
        'marketName'
        ]
      expect(bidEdgeMarketName).toBe(expectedMarketName)
      expect(askEdgeMarketName).toBe(expectedMarketName)
    })

    it('#createBidEdge does not replace edge if the price is worse', () => {
      data = {
        LUNO: {
          AAABBB: {
            asks: [['18', '2']],
            bids: [['12', '3']],
          },
        },
        BINANCE: {
          AAABBB: {
            asks: [['19', '2']],
            bids: [['11', '3']],
          },
        },
      }

      service.populateGraph(data)
      const expectedMarketName = 'LUNO'
      const bidEdgeMarketName = service.graph.getEdgeWeight('BBB', 'AAA')[
        'marketName'
        ]

      const askEdgeMarketName = service.graph.getEdgeWeight('AAA', 'BBB')[
        'marketName'
        ]
      expect(bidEdgeMarketName).toBe(expectedMarketName)
      expect(askEdgeMarketName).toBe(expectedMarketName)
    })
  })

  describe('#calculateGraphWeights', () => {
    it('calculates weights to negative natural log', () => {
      const data: MarketData = {
        LUNO: {
          AAABBB: {
            asks: [[17, 2]],
            bids: [[12, 3]],
          },
        },
      }
      let service = new GraphService(Graph())
      service.populateGraph(data)
      const askPrice = +data['LUNO']['AAABBB']['asks'][0][0]
      const bidPrice = +data['LUNO']['AAABBB']['bids'][0][0]
      const adjustedAskPrice = service.adjustPriceWithMarketFee(
        askPrice,
        'LUNO',
        TransactionType.ASKS,
      )
      const valueToReciprocal = 1 / adjustedAskPrice
      const askPriceLoggedToNegative = Math.log(valueToReciprocal) * -1
      const adjustedBidPrice = service.adjustPriceWithMarketFee(
        bidPrice,
        'LUNO',
        TransactionType.BIDS,
      )
      const bidPriceLoggedToNegative = Math.log(adjustedBidPrice) * -1

      service.recalculateEdgeWeights()
      const graph = service.getGraph()

      expect(graph.getEdgeWeight('AAA', 'BBB').price).toEqual(
        askPriceLoggedToNegative,
      )
      expect(graph.getEdgeWeight('BBB', 'AAA').price).toEqual(
        bidPriceLoggedToNegative,
      )
    })
  })

  describe('#calculateArbitrage', () => {
    it('should return 2 nested arrays with none zero return rates', () => {
      const data: MarketData = {
        GDAX: {
          ETHBTC: {
            // ask is lower than bid -> this will result in negative cycle
            asks: [[0.041, 1, 8]],
            bids: [[0.045, 1, 8]],
          },
        },
      }
      let service = new GraphService(Graph())
      service.populateGraph(data).recalculateEdgeWeights().findNegativeCycles()
      let resultNode: ResultNode[] = [
        {
          source: 'BTC',
          target: 'ETH',
          market: 'GDAX',
        }, { source: 'ETH', target: 'BTC', market: 'GDAX' }]
      const expected: ArbitrageResult[] = [
        {
          path: resultNode,
          expectedReturn: 0.08,
        }]
      const actual = service.getArbitrageResults()
      expect(actual).toEqual(expected)
    })

    it('should calculate rate as 0 if no negative cycles', () => {
      const cycle = []
      let graphService = new GraphService(Graph())
      expect(graphService.getArbitrageResult(cycle)).toEqual({
        expectedReturn: 0,
        path: [],
      })
    })
  })
})
