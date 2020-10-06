import Graph = require("../src/graph-library");
import { AsksBids, MarketRates, MarketData } from "./models/MarketData";
import { EdgeValues } from "./models/EdgeValues";
import { MARKET_FEES } from "./models/MarketFees";

export enum TransactionType {
  ASKS = "asks",
  BIDS = "bids",
}

class GraphService {
  private graph;
  constructor() {
    this.graph = Graph();
  }

  getOneOverValue(value: number): number {
    return 1 / value;
  }

  valueToNaturalLog(value: number): number {
    return Math.log(value);
  }

  valueToNegative(value: number): number {
    return value * -1;
  }

  transactionCostAdjustment(
    price: number,
    marketName: string,
    transactionType: string
  ): number {
    let priceWithFee: number;
    marketName = marketName.toUpperCase();

    if (MARKET_FEES[marketName] == undefined)
      throw Error("Invalid market name");

    if (transactionType === TransactionType.ASKS) {
      //increase the rate of the asset, which makes it less attrative
      priceWithFee = price * (1 + MARKET_FEES[marketName] / 100);
      return priceWithFee;
    } else if (transactionType === TransactionType.BIDS) {
      //decrease the max rate at which people will pay for our asset
      priceWithFee = price * (1 - MARKET_FEES[marketName] / 100);
      return priceWithFee;
    }
    throw Error("Invalid transaction type");
  }

  pairOne(pair: string): string {
    return pair.substring(0, 3);
  }
  pairTwo(pair: string): string {
    return pair.substring(3, 7);
  }

  valueToLog(value: number): number {
    return Math.log(+value);
  }

  getFirstOffer(transactionType: string, data: AsksBids) {
    if (
      transactionType === TransactionType.ASKS ||
      transactionType === TransactionType.BIDS
    ) {
      return transactionType === TransactionType.ASKS
        ? data[TransactionType.ASKS][0]
        : data[TransactionType.BIDS][0];
    }

    throw Error("Invalid transaction type");
  }

  createEdgeValues(
    transactionType: string,
    data: AsksBids,
    marketName: string
  ): EdgeValues {
    const firstValue = this.getFirstOffer(transactionType, data);
    const price = +firstValue[0];
    const priceAdjustedByMarketFee = this.transactionCostAdjustment(
      price,
      marketName,
      transactionType
    );
    const volume = +firstValue[1];
    const isAsk = transactionType === TransactionType.ASKS;

    return {
      price: priceAdjustedByMarketFee,
      volume,
      marketName,
      isAsk,
    };
  }

  isEdgeMissing(edgeValues) {
    // if === 1, edge doesn't exist
    return edgeValues === 1;
  }

  getPriceFromEdgeValues(edgeValues: EdgeValues): number {
    return edgeValues["price"];
  }

  isPriceBetter(
    isAsk: boolean,
    sourceNode: string,
    targetNode: string,
    newPrice: number
  ): boolean {
    const currentEdgeValues: EdgeValues = this.graph.getEdgeWeight(
      sourceNode,
      targetNode
    );

    if (this.isEdgeMissing(currentEdgeValues)) return true;

    const currentPrice = this.getPriceFromEdgeValues(currentEdgeValues);
    // we want lowest possible asking price
    if (isAsk) {
      return +currentPrice > +newPrice;
    }
    // wa want highest possible bidding price
    return +currentPrice < +newPrice;
  }

  // BID
  // BTCETH -> bid -> we sell ETH for BTC, edge direction is BTC <-- ETH
  createBidEdge(pair: string, values: AsksBids, marketName: string): void {
    const [price, volume] = this.getFirstOffer(TransactionType.BIDS, values);
    const sourceNode = this.pairTwo(pair);
    const targetNode = this.pairOne(pair);

    if (this.isPriceBetter(false, sourceNode, targetNode, price)) {
      this.graph.addEdge(
        sourceNode,
        targetNode,
        this.createEdgeValues(TransactionType.BIDS, values, marketName)
      );
    }
  }

  // ASK
  // BTCETH -> ask -> we buy ETH for BTC, edge direction is BTC --> ETH
  createAskEdge(pair: string, values: AsksBids, marketName: string): void {
    const [price, volume] = this.getFirstOffer(TransactionType.ASKS, values);
    const sourceNode = this.pairOne(pair);
    const targetNode = this.pairTwo(pair);

    if (this.isPriceBetter(true, sourceNode, targetNode, price)) {
      this.graph.addEdge(
        sourceNode,
        targetNode,
        this.createEdgeValues(TransactionType.ASKS, values, marketName)
      );
    }
  }

  populateGraph(data: MarketData): any {
    Object.keys(data).forEach((marketName: string) => {
      Object.keys(data[marketName]).forEach((pair: string) => {
        this.createBidEdge(pair, data[marketName][pair], marketName);
        this.createAskEdge(pair, data[marketName][pair], marketName);
      });
    });

    return this.graph;
  }

  recalculateEdgeWeights(): void {
    let edges = this.graph.getEdges();
    for (let sourceNode in edges) {
      for (let targetNode of edges[sourceNode]) {
        let currentWeight = this.graph.getEdgeWeight(sourceNode, targetNode);
        let updatedPrice = currentWeight.price;

        if (currentWeight.isAsk) {
          updatedPrice = this.getOneOverValue(updatedPrice);
        }

        updatedPrice = this.valueToNaturalLog(updatedPrice);
        updatedPrice = this.valueToNegative(updatedPrice);
        currentWeight.price = updatedPrice;

        this.graph.setEdgeWeight(sourceNode, targetNode, currentWeight);
      }
    }
  }
}
export { GraphService };
