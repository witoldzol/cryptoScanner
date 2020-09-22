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
      const transaction = "asks";
      const result = service.transactionCostAdjustment(
        price,
        market,
        transaction
      );
      expect(result).toEqual(101);
    });

    it("lowers price by market fee when selling (asks)", () => {
      const transaction = "bids";
      const result = service.transactionCostAdjustment(
        price,
        market,
        transaction
      );
      expect(result).toEqual(99);
    });

    it("throws error when invalid market name is given", () => {
      const transaction = "asks";
      const invalidMarket = "gimme yo mannie";
      expect(() => {
        service.transactionCostAdjustment(price, invalidMarket, transaction);
      }).toThrowError("Invalid market name");
    });

    it("throws error when invalid transaction is given", () => {
      const invalidTransaction = "asks and you shall receive";
      expect(() => {
        service.transactionCostAdjustment(price, market, invalidTransaction);
      }).toThrowError("Invalid transaction type");
    });
  });

  describe("#populateGraph", () => {
    let data;
    beforeEach(() => {
      data = {
        LUNO: {
          AAABBB: {
            asks: [["17", "2"]],
            bids: [["12", "3"]],
          },
        },
      };
    });
    it("creates a valid graph", () => {
      const graph = service.populateGraph(data);

      expect(graph.nodes().length).toBe(2);
      expect(graph.adjacent("AAA").length).toBe(1);
    });

    it("#createEdgeValues returns original price", () => {
      const graph = service.populateGraph(data);
      const expectedOutput = {
        price: +data["LUNO"]["AAABBB"]["asks"][0][0],
        volume: +data["LUNO"]["AAABBB"]["asks"][0][1],
        marketName: "LUNO",
        isAsk: true,
      };

      expect(graph.getEdgeWeight("AAA", "BBB")).toEqual(expectedOutput);
    });

    it("#getFirstOffer throws error if transaction type is not asks or bids", () => {
      expect(() => {
        service.getFirstOffer("bla", { asks: [1, 1], bids: [2, 2] });
      }).toThrowError("Invalid transaction type");
    });

    it("#createBidEdge replace edge if the price is better", () => {
      data = {
        LUNO: {
          AAABBB: {
            asks: [["18", "2"]],
            bids: [["12", "3"]],
          },
        },
        BINANCE: {
          AAABBB: {
            asks: [["15", "2"]],
            bids: [["13", "3"]],
          },
        },
      };

      service.populateGraph(data);
      const expectedMarketName = "BINANCE";
      const bidEdgeMarketName = service.graph.getEdgeWeight("BBB", "AAA")[
        "marketName"
      ];

      const askEdgeMarketName = service.graph.getEdgeWeight("AAA", "BBB")[
        "marketName"
      ];
      expect(bidEdgeMarketName).toBe(expectedMarketName);
      expect(askEdgeMarketName).toBe(expectedMarketName);
    });

    it("#createBidEdge does not replace edge if the price is worse", () => {
      data = {
        LUNO: {
          AAABBB: {
            asks: [["18", "2"]],
            bids: [["12", "3"]],
          },
        },
        BINANCE: {
          AAABBB: {
            asks: [["19", "2"]],
            bids: [["11", "3"]],
          },
        },
      };

      service.populateGraph(data);
      const expectedMarketName = "LUNO";
      const bidEdgeMarketName = service.graph.getEdgeWeight("BBB", "AAA")[
        "marketName"
      ];

      const askEdgeMarketName = service.graph.getEdgeWeight("AAA", "BBB")[
        "marketName"
      ];
      expect(bidEdgeMarketName).toBe(expectedMarketName);
      expect(askEdgeMarketName).toBe(expectedMarketName);
    });
  });

  describe("#calculateGraphWeights", () => {
    let data;
    beforeEach(() => {
      data = {
        LUNO: {
          AAABBB: {
            asks: [["17", "2"]],
            bids: [["12", "3"]],
          },
        },
      };
    });

    it("calculates weights to negative natural log", () => {
      service.populateGraph(data);
      const askPrice = Math.log(1 / +data["LUNO"]["AAABBB"]["asks"][0][0]) * -1;
      const bidPrice = Math.log(+data["LUNO"]["AAABBB"]["bids"][0][0]) * -1;

      service.recalculateEdgeWeights();

      expect(service.graph.getEdgeWeight("AAA", "BBB").price).toEqual(askPrice);
      expect(service.graph.getEdgeWeight("BBB", "AAA").price).toEqual(bidPrice);
    });
  });
});
