const graphService = require("../built/graph-service.js");
const Graph = require("../built/graph-library.js");

describe("Graph library", () => {
  let service;

  beforeEach(() => {
    service = new graphService();
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
    let mockGraph = graphService.populateGraph(data);
  });
});
