import { AsksBids, MarketData } from './models/MarketData'
import { EdgeValues } from './models/EdgeValues'
import { MARKET_FEES } from './models/MarketFees'

export interface ResultNode {
  source: string,
  target: string,
  market: string
}

export interface ArbitrageResult {
  path: ResultNode[],
  expectedReturn: number
}

interface SourceTargetPair {
  source: string
  target: string
}

export enum TransactionType {
  ASKS = 'asks',
  BIDS = 'bids',
}

class GraphService {
  graph
  private negativeCycles: []

  constructor (graph) {
    this.graph = graph
  }

  getGraph () {
    return this.graph
  }

  valueToReciprocal (value: number): number {
    return 1 / value
  }

  valueToNaturalLog (value: number): number {
    return Math.log(+value)
  }

  valueToNegative (value: number): number {
    return value * -1
  }

  validateMarketName (marketName: string): void {
    if (MARKET_FEES[marketName.toUpperCase()] === undefined) {
      throw Error('Invalid market name')
    }
  }

  validateTransactionType (transactionType: string): void {
    if (
      transactionType !== TransactionType.ASKS &&
      transactionType !== TransactionType.BIDS
    ) {
      throw Error('Invalid transaction type')
    }
  }

  adjustPriceWithMarketFee (
    price: number,
    marketName: string,
    transactionType: string,
  ): number {
    marketName = marketName.toUpperCase()
    this.validateMarketName(marketName)
    this.validateTransactionType(transactionType)

    return transactionType === TransactionType.ASKS
      ? //increase the rate of the asset, which makes it less attractive
      price * (1 + MARKET_FEES[marketName] / 100)
      : //decrease the max rate at which people will pay for our asset
      price * (1 - MARKET_FEES[marketName] / 100)
  }

  pairOne (pair: string): string {
    return pair.substring(0, 3).toUpperCase()
  }

  pairTwo (pair: string): string {
    return pair.substring(3, 7).toUpperCase()
  }

  getFirstOfferFromData (transactionType: string, data: AsksBids) {
    this.validateTransactionType(transactionType)

    return data[transactionType][0]
  }

  createEdgeValues (
    transactionType: string,
    data: AsksBids,
    marketName: string,
  ): EdgeValues {
    const firstValue = this.getFirstOfferFromData(transactionType, data)
    const price = +firstValue[0]
    const volume = +firstValue[1]
    const priceAdjustedByMarketFee = this.adjustPriceWithMarketFee(
      price,
      marketName,
      transactionType,
    )
    const isAsk = transactionType === TransactionType.ASKS

    return {
      price: priceAdjustedByMarketFee,
      volume,
      marketName,
      isAsk,
    }
  }

  isEdgeMissing (edgeValues: EdgeValues | number) {
    // if === 1, edge doesn't exist
    return edgeValues === 1
  }

  isPriceBetter (
    tranctionType: TransactionType,
    sourceTargetPair: SourceTargetPair,
    newPrice: number,
  ): boolean {

    const currentEdgeValues: EdgeValues = this.graph.getEdgeWeight(
      sourceTargetPair.source,
      sourceTargetPair.target,
    )

    // if (this.isEdgeMissing(currentEdgeValues)) return true

    const currentPrice = currentEdgeValues.price
    // we want lowest possible asking price
    if (tranctionType === TransactionType.ASKS) {
      return +currentPrice > +newPrice
    }
    // wa want highest possible bidding price
    return +currentPrice < +newPrice
  }

  // BID
  // BTCETH -> bid -> we sell ETH for BTC, edge direction is BTC <-- ETH
  createBidEdge (pair: string, values: AsksBids, marketName: string): void {
    const transactionType = TransactionType.BIDS

    const [price, volume] = this.getFirstOfferFromData(
      transactionType,
      values,
    )

    const sourceTargetPair = this.getSourceTargetPairForBidEdge(pair)

    const adjustedPrice = this.adjustPriceWithMarketFee(
      price,
      marketName,
      transactionType,
    )

    const newEdgeValues = this.createEdgeValues(transactionType, values,
      marketName)

    this.createOrUpdateEdge(sourceTargetPair, transactionType, adjustedPrice,
      newEdgeValues)
  }

  // ASK
  // BTCETH -> ask -> we buy ETH for BTC, edge direction is BTC --> ETH
  createAskEdge (pair: string, values: AsksBids, marketName: string): void {
    const transactionType = TransactionType.ASKS

    const [price, volume] = this.getFirstOfferFromData(
      transactionType,
      values,
    )

    const sourceTargetPair = this.getSourceTargetPairForAskEdge(pair)

    const adjustedPrice = this.adjustPriceWithMarketFee(
      price,
      marketName,
      transactionType,
    )

    const newEdgeValues = this.createEdgeValues(transactionType, values,
      marketName)

    this.createOrUpdateEdge(sourceTargetPair, transactionType, adjustedPrice,
      newEdgeValues)
  }

  private getSourceTargetPairForBidEdge (pair): SourceTargetPair {
    return {
      source: this.pairTwo(pair),
      target: this.pairOne(pair),
    }
  }

  private getSourceTargetPairForAskEdge (pair): SourceTargetPair {
    return {
      source: this.pairOne(pair),
      target: this.pairTwo(pair),
    }
  }

  private createOrUpdateEdge (
    sourceTargetPair: SourceTargetPair,
    transactionType: TransactionType,
    adjustedPrice: number, newEdgeValues) {
    const currentEdgeValues: EdgeValues = this.graph.getEdgeWeight(
      sourceTargetPair.source,
      sourceTargetPair.target,
    )

    if (this.isEdgeMissing(currentEdgeValues)) {
      this.graph.addEdge(
        sourceTargetPair.source,
        sourceTargetPair.target,
        newEdgeValues,
      )
      return
    }

    if (this.isPriceBetter(transactionType, sourceTargetPair, adjustedPrice)) {
      this.graph.setEdgeWeight(
        sourceTargetPair.source,
        sourceTargetPair.target,
        newEdgeValues,
      )
    }
  }

  populateGraph (data: MarketData): GraphService {
    Object.keys(data).forEach((marketName: string) => {
      Object.keys(data[marketName]).forEach((pair: string) => {
        this.createBidEdge(pair, data[marketName][pair], marketName)
        this.createAskEdge(pair, data[marketName][pair], marketName)
      })
    })
    return this
  }

  // once we have populated graph with best prices
  // we can recalculate them so that they can be used in bellman-ford algorithm
  recalculateEdgeWeights (): GraphService {
    let edges = this.graph.getEdges()
    for (let sourceNode in edges) {
      for (let targetNode of edges[sourceNode]) {
        let currentWeight = this.graph.getEdgeWeight(sourceNode, targetNode)
        let updatedPrice = currentWeight.price
        if (currentWeight.isAsk) {
          updatedPrice = this.valueToReciprocal(updatedPrice)
        }

        updatedPrice = this.valueToNaturalLog(updatedPrice)
        updatedPrice = this.valueToNegative(updatedPrice)
        currentWeight.price = updatedPrice

        this.graph.setEdgeWeight(sourceNode, targetNode, currentWeight)
      }
    }
    return this
  }

  getArbitrageResult (cycle: string[]): ArbitrageResult {
    let result: ArbitrageResult = { expectedReturn: 0, path: [] }
    if (cycle.length < 2) return result

    for (let i = 0; i < cycle.length - 1; i++) {
      let { source, target, price, market } = this.extractEdgeValues(cycle, i)
      let node: ResultNode = { market, source, target }
      result.path.push(node)
      result.expectedReturn += price
    }
    result.expectedReturn = +this.valueToNegative(result.expectedReturn).
      toFixed(2)

    return result
  }

  private extractEdgeValues (cycle: string[], i: number) {
    let source = cycle[i]
    let target = cycle[i + 1]
    let edgeWeight = this.graph.getEdgeWeight(source, target)
    let price = edgeWeight.price
    let market = edgeWeight.marketName
    return { source, target, price, market }
  }

  getArbitrageResults (): ArbitrageResult[] {
    if (!this.negativeCycles.length) return []
    let result: ArbitrageResult[] = []

    this.negativeCycles.forEach((cycle: string[]) => {
      result.push(this.getArbitrageResult(cycle))
    })
    return result
  }

  findNegativeCycles (): GraphService {
    this.negativeCycles = this.graph.findNegativeCycles()
    return this
  }
}

export { GraphService }
