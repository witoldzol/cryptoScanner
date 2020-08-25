import Graph = require("../src/graph-library");
import { AsksBids, MarketRates, MarketData } from "./models/MarketData";

interface EdgeValues {
  priceToLogAndNegative: number;
  priceWithFees: number;
  volume: number;
  marketName: string;
  askOrBid: string;
}

class GraphService {
  constructor() {}

  getOneOverValue(value: number): number {
    return 1 / value;
  }

  calculateAskRate(asksArray: number[]): number[] {
    asksArray[0] = this.getOneOverValue(asksArray[0]);
    return asksArray;
  }

  getAsksFirstElement(data: AsksBids): number[] {
    return this.calculateAskRate(data["asks"][0]);
  }

  getBidsFirstElement(data: AsksBids): number[] {
    return data["bids"][0];
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
    const MARKET_FEES: MarketRates = {
      luno: 1,
      binance: 0.1,
      gdax: 0.5,
    };
    let priceWithFee;
    marketName = marketName.toLocaleLowerCase();

    if (MARKET_FEES[marketName] == undefined)
      throw Error("Invalid market name");

    if (transactionType === "ask") {
      //increase the rate of the asset, which makes it less attrative
      priceWithFee = price * (1 + MARKET_FEES[marketName] / 100);
      return priceWithFee;
    } else if (transactionType === "bid") {
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

  calculateEdgeValues(
    arrWithPriceAndVolume: number[],
    marketName: string,
    askOrBid: string
  ): EdgeValues {
    let edgeValues = {
      priceToLogAndNegative: null,
      priceWithFees: null,
      volume: null,
      marketName: null,
      askOrBid: null,
    };

    const price = +arrWithPriceAndVolume[0];
    const volume = +arrWithPriceAndVolume[1];

    let priceWithFees: number = this.transactionCostAdjustment(
      price,
      marketName,
      askOrBid
    );

    let priceToLogToNegative = this.valueToNegative(
      this.valueToLog(priceWithFees)
    );

    // TODO: do we need both normalisedRate && adjustedRateForMarketFee??
    edgeValues.priceWithFees = priceWithFees;
    edgeValues.priceToLogAndNegative = priceToLogToNegative;
    edgeValues.volume = volume;
    edgeValues.marketName = marketName;
    edgeValues.askOrBid = askOrBid;

    return edgeValues;
  }

  addRoot(graph) {
    graph.topologicalSort().map((currencyNode: string) => {
      graph.addEdge("ROOT_NODE", currencyNode, [0, 0, "ROOT_NODE", "ask"]);
    });
    return graph;
  }
  createEdges(graph, pair: string, values: AsksBids, marketName: string): any {
    //create edge with PAIR1,PAIR2,PROPERTIES [amount,volume,market name]
    //BID - we sell pair 1
    graph.addEdge(
      this.pairOne(pair),
      this.pairTwo(pair),
      this.calculateEdgeValues(
        this.getBidsFirstElement(values),
        marketName,
        "bid"
      )
    );
    //ASK - we buy
    graph.addEdge(
      this.pairTwo(pair),
      this.pairOne(pair),
      this.calculateEdgeValues(
        this.getAsksFirstElement(values),
        marketName,
        "ask"
      )
    );
    return graph;
  }

  buildGraph(data: MarketData) {
    let graph = Graph();

    Object.keys(data).forEach((marketName: string) => {
      //iterate over currencies in the market
      Object.keys(data[marketName]).forEach((pair: string) => {
        graph = this.createEdges(
          graph,
          pair,
          data[marketName][pair],
          marketName
        );
      });
    });

    graph = this.addRoot(graph);
    return graph;
  }
}
export { GraphService };
