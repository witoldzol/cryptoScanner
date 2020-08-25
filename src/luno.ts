import util = require("./util");
import { MarketOptions } from "./models/MarketOptions";
import { MarketData } from "./models/MarketData";

const pairs = ["XBTIDR", "XBTMYR", "XBTNGN", "XBTZAR", "ETHXBT"];

function formatData(data: object[]): MarketData {
  let combinedData = util.mapDataToObject(data);
  // TODO: keep object key:value format - update other merkets to convert arrays to more meaningful objects
  let formattedData = util.convertObjectToArray(combinedData);
  //luno uses XBT to represent BTC - replace for uniformity
  let formattedDataWithUpdatedKeys = util.updateObjectKeys(
    formattedData,
    "XBT",
    "BTC"
  );
  let wrapper = util.wrapDataInObjectWithMarketName(
    formattedDataWithUpdatedKeys,
    this.marketName
  );

  return wrapper;
}

const options: MarketOptions = {
  marketName: "LUNO",
  baseURL: "https://api.mybitx.com/api/1",
  urlPath: ["/orderbook?pair=", ""],
  pairs: pairs,
  maxConcurrentRequests: 2,
  formatData: formatData,
};

export { options };
