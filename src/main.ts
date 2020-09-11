import { lunoOptions } from "./luno";
import { binanceOptions } from "./binance";
import { gdaxOptions } from "./gdax";
import { getPrices } from "./market-service";
import { mapDataToObject } from "./util";
import { GraphService } from "./graph-service";

let graphService = new GraphService();

let lunoPrices = getPrices(lunoOptions);
let gdaxPrices = getPrices(gdaxOptions);
let binancePrices = getPrices(binanceOptions);

Promise.all([lunoPrices, gdaxPrices, binancePrices])
  .then((data) => mapDataToObject(data))
  .then((data) => {
    console.log(" MAIN \n" + JSON.stringify(data));
    return data;
  })
  .then((data) => graphService.populateGraph(data))
  .then((graph) => graph.findNegativeCycles())
  .then((result) => console.log(result))
  .catch((e) => console.log("error from main pricess ALL.Promise: " + e.stack));
