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
      expect(service.valueToReciprocal(mockValue)).toBe(expectedValue);
    });
  });

  describe("#valueToLog", () => {
    it("returns correct value", () => {
      let mockValue = 12;
      let expectedValue = Math.log(mockValue);

      expect(service.valueToNaturalLog(mockValue)).toBe(expectedValue);
    });
  });

  describe("#adjustPriceWithMarketFee", () => {
    const price = 100;
    const market = "luno";
    it("increases price by market fee when buying (asks)", () => {
      const transaction = "asks";
      const result = service.adjustPriceWithMarketFee(
        price,
        market,
        transaction
      );
      expect(result).toEqual(101);
    });

    it("lowers price by market fee when selling (asks)", () => {
      const transaction = "bids";
      const result = service.adjustPriceWithMarketFee(
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
        service.adjustPriceWithMarketFee(price, invalidMarket, transaction);
      }).toThrowError("Invalid market name");
    });

    it("throws error when invalid transaction is given", () => {
      const invalidTransaction = "asks and you shall receive";
      expect(() => {
        service.adjustPriceWithMarketFee(price, market, invalidTransaction);
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

    it("#getFirstOfferFromData throws error if transaction type is not asks or bids", () => {
      expect(() => {
        service.getFirstOfferFromData("bla", { asks: [1, 1], bids: [2, 2] });
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

  it("#transactionCostAdjustment - market with high fees is rejected as the price is made worse", () => {
    // Market fees -> binance is more attractive than luno
    // LUNO: 1,
    // BINANCE: 0.1,

    let data = {
      LUNO: {
        AAABBB: {
          asks: [["18", "2"]],
          bids: [["12", "3"]],
        },
      },
      BINANCE: {
        AAABBB: {
          asks: [["18", "2"]],
          bids: [["12", "3"]],
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
      let graph = service.populateGraph(data);
      const askPrice = +data["LUNO"]["AAABBB"]["asks"][0][0];
      const bidPrice = +data["LUNO"]["AAABBB"]["bids"][0][0];
      const adjustedAskPrice = service.adjustPriceWithMarketFee(
        askPrice,
        "LUNO",
        "asks"
      );
      const valueToReciprocal = 1 / adjustedAskPrice;
      const askPriceLoggedToNegative = Math.log(valueToReciprocal) * -1;
      const adjustedBidPrice = service.adjustPriceWithMarketFee(
        bidPrice,
        "LUNO",
        "bids"
      );
      const bidPriceLoggedToNegative = Math.log(adjustedBidPrice) * -1;

      graph = service.recalculateEdgeWeights(graph);

      expect(graph.getEdgeWeight("AAA", "BBB").price).toEqual(
        askPriceLoggedToNegative
      );
      expect(graph.getEdgeWeight("BBB", "AAA").price).toEqual(
        bidPriceLoggedToNegative
      );
    });
  });
});
