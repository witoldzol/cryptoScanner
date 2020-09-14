import { GraphService } from "../src/graph-service";

describe("GraphService", () => {
  let service;
  beforeEach(() => {
    service = new GraphService();
  });

  describe("getOneOverValue", () => {
    it("returns correct value", () => {
      let mockValue = 17;
      let expectedValue = 1 / 17;
      expect(service.getOneOverValue(mockValue)).toBe(expectedValue);
    });
  });

  describe("#calculateAskRate", () => {
    it("returns correct value", () => {
      let mockArr = [17, 99];
      let expectedValue = 1 / 17;
      expect(service.calculateAskRate(mockArr)[0]).toBe(expectedValue);
      expect(service.calculateAskRate(mockArr)[1]).toBe(99);
    });
  });

  describe("getAsksFirstElement", () => {
    it("returns correct value", () => {
      let mockAsksBids = { asks: [[33, 1]], bids: [[32, 2]] };
      let expectedValue = [1 / 33, 1];
      expect(service.getAsksFirstElement(mockAsksBids)).toEqual(expectedValue);
    });
  });

  describe("getAsksFirstElement", () => {
    it("returns correct value", () => {
      let mockAsksBids = { asks: [[33, 1]], bids: [[32, 2]] };
      let expectedValue = [1 / 33, 1];
      expect(service.getAsksFirstElement(mockAsksBids)).toEqual(expectedValue);
    });
  });

  describe("getBidsFirstElement", () => {
    it("returns correct value", () => {
      let mockAsksBids = { asks: [[33, 1]], bids: [[32, 2]] };
      let expectedValue = [32, 2];
      expect(service.getBidsFirstElement(mockAsksBids)).toEqual(expectedValue);
    });
  });

  describe("#valueToLog", () => {
    it("returns correct value", () => {
      let mockValue = 12;
      let expectedValue = Math.log(mockValue);

      expect(service.valueToNaturalLog(mockValue)).toBe(expectedValue);
    });
  });

  describe("#transactionCostAdjustment", () => {
    const price = 100;
    const market = "luno";
    it("increases price by market fee when buying (asks)", () => {
      const transaction = "ask";
      const result = service.transactionCostAdjustment(
        price,
        market,
        transaction
      );
      expect(result).toEqual(101);
    });

    it("lowers price by market fee when selling (asks)", () => {
      const transaction = "bid";
      const result = service.transactionCostAdjustment(
        price,
        market,
        transaction
      );
      expect(result).toEqual(99);
    });

    it("throws error when invalid market name is given", () => {
      const transaction = "ask";
      const invalidMarket = "gimme yo mannie";
      expect(() => {
        service.transactionCostAdjustment(price, invalidMarket, transaction);
      }).toThrowError("Invalid market name");
    });

    it("throws error when invalid transaction is given", () => {
      const invalidTransaction = "ask and you shall receive";
      expect(() => {
        service.transactionCostAdjustment(price, market, invalidTransaction);
      }).toThrowError("Invalid transaction type");
    });
  });

  describe("#calculateEdgeValues", () => {
    it("it calculates correct values", () => {
      spyOn(service, "transactionCostAdjustment").and.returnValue(333);

      let arrWithPriceAndVolume = [10, 2];
      let marketName = "luno";
      let askOrBid = "ask";

      let expectedValue = {
        price: -5.808142489980444,
        volume: 2,
        marketName: marketName,
      };

      expect(
        service.calculateEdgeValues(arrWithPriceAndVolume, marketName, askOrBid)
      ).toEqual(expectedValue);
    });
  });

  describe("#populateGraph", () => {
    it("creates a valid graph", () => {
      let data = {
        LUNO: {
          BTCIDR: {
            asks: [["174400000.00", "0.041224"]],
            bids: [["174400000.00", "0.041224"]],
          },
        },
        GDAX: {
          ETHBTC: {
            asks: [["0.03378", "59.59791775", 8]],
            bids: [["0.03378", "59.59791775", 8]],
          },
        },
        BINANCE: {
          LTCBTC: {
            asks: [["0.00509700", "29.51000000"]],
            bids: [["0.00509700", "29.51000000"]],
          },
        },
      };

      const graph = service.populateGraph(data);

      expect(graph.nodes().length).toBe(4);
      expect(graph.adjacent("BTC").length).toBe(3);
    });
  });
});
