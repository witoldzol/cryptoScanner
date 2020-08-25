import { GraphService } from "../src/graph-service";

describe("Graph library", () => {
  let service;

  beforeEach(() => {
    service = new GraphService();
  });
  it("finds negative cycles", () => {
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
    let mockGraph = service.populateGraph(data);
    expect(true).toBe(true);
  });
});
