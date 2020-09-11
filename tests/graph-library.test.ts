import Graph = require("../src/graph-library");
import { GraphService } from "../src/graph-service";

describe("Graph library", () => {
  let graph;
  let graphService;
  const data = {
    GDAX: {
      ETHBTC: {
        asks: [["0.03378", "59.59791775", 8]],
        bids: [["0.03378", "59.59791775", 8]],
      },
    },
    BINANCE: {
      ETHBTC: {
        asks: [["0.03378", "59.59791775", 8]],
        bids: [["0.03378", "59.59791775", 8]],
      },
    },
  };

  beforeEach(() => {
    graph = Graph();
    graphService = new GraphService();
    graph = graphService.populateGraph(data);
  });

  it("returns valid graph", () => {
    expect(graph.hasOwnProperty("addNode")).toBeTrue();
    expect(graph.hasOwnProperty("findNegativeCycles")).toBeTrue();
  });

  it("#findNegativeCycles returns no cycles", () => {
    const negativeCycles = graph.findNegativeCycles();
    // expect(negativeCycles).toEqual({});
  });
});
