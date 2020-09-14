import Graph = require("../src/graph-library");
import { AsksBids, MarketRates, MarketData } from "./models/MarketData";
import { EdgeValues } from "./models/EdgeValues";

class GraphService {
  private graph;
  constructor() {
    this.graph = Graph();
  }

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
      price: null,
      volume: null,
      marketName: null,
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

    edgeValues.price = priceToLogToNegative;
    edgeValues.volume = volume;
    edgeValues.marketName = marketName;

    return edgeValues;
  }

  // bid is a reversal of order of transaction
  // BTCETH -> bid -> we sell ETH for BTC, edge direction is BTC <-- ETH
  createBidEdge(pair: string, values: AsksBids, marketName: string): void {
    this.graph.addEdge(
      this.pairTwo(pair),
      this.pairOne(pair),
      this.calculateEdgeValues(
        this.getBidsFirstElement(values),
        marketName,
        "bid"
      )
    );
  }

  // ask
  // BTCETH -> ask -> we buy ETH for BTC, edge direction is BTC --> ETH
  createAskEdge(pair: string, values: AsksBids, marketName: string): void {
    //ASK - we buy
    this.graph.addEdge(
      this.pairOne(pair),
      this.pairTwo(pair),
      this.calculateEdgeValues(
        this.getAsksFirstElement(values),
        marketName,
        "ask"
      )
    );
  }

  populateGraph(data: MarketData): any {
    Object.keys(data).forEach((marketName: string) => {
      //iterate over currencies in the market
      Object.keys(data[marketName]).forEach((pair: string) => {
        this.createBidEdge(pair, data[marketName][pair], marketName);
        this.createAskEdge(pair, data[marketName][pair], marketName);
      });
    });

    return this.graph;
  }
}
export { GraphService };
