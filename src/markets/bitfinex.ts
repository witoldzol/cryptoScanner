import { Market } from './Market'
import { MarketOptions } from './../models/MarketOptions'
import { MarketData } from './../models/MarketData'

// we can get data for all tickers with one call
const pairs: string[] = ['tBTCUSD,tLTCUSD,tLTCBTC,tETHUSD,tETHBTC,tETCBTC,tETCUSD,tRRTUSD,tZECUSD,tZECBTC,tXMRUSD,tXMRBTC,tDSHUSD,tDSHBTC,tBTCEUR,tBTCJPY,tXRPUSD,tXRPBTC,tIOTUSD,tIOTBTC,tIOTETH,tEOSUSD,tEOSBTC,tEOSETH,tSANUSD,tSANBTC,tSANETH,tOMGUSD,tOMGBTC,tOMGETH,tNEOUSD,tNEOBTC,tNEOETH,tETPUSD,tETPBTC,tETPETH,tQTMUSD,tQTMBTC,tEDOUSD,tEDOBTC,tEDOETH,tBTGUSD,tBTGBTC,tDATUSD,tDATBTC,tQSHUSD,tYYWUSD,tGNTUSD,tSNTUSD,tIOTEUR,tBATUSD,tBATBTC,tBATETH,tMNAUSD,tMNABTC,tFUNUSD,tZRXUSD,tZRXBTC,tZRXETH,tTRXUSD,tTRXBTC,tTRXETH,tSNGUSD,tREPUSD,tREPBTC,tNECUSD,tBTCGBP,tETHEUR,tETHJPY,tETHGBP,tNEOEUR,tNEOJPY,tNEOGBP,tEOSEUR,tEOSJPY,tEOSGBP,tIOTJPY,tIOTGBP,tREQUSD,tLRCUSD,tWAXUSD,tDAIUSD,tDAIBTC,tDAIETH,tBFTUSD,tODEUSD,tANTUSD,tANTBTC,tANTETH,tSTJUSD,tXLMUSD,tXLMBTC,tXLMETH,tXVGUSD,tMKRUSD,tKNCUSD,tKNCBTC,tPOAUSD,tLYMUSD,tUTKUSD,tVEEUSD,tORSUSD,tZCNUSD,tESSUSD,tIQXUSD,tZILUSD,tZILBTC,tBNTUSD,tXRAUSD,tDGXUSD,tVETUSD,tVETBTC,tGOTUSD,tGOTEUR,tXTZUSD,tXTZBTC,tTRXEUR,tYGGUSD,tMLNUSD,tOMNUSD,tOMNBTC,tPNKUSD,tPNKETH,tDGBUSD,tBSVUSD,tBSVBTC,tENJUSD,tRBTUSD,tRBTBTC,tUSTUSD,tEUTEUR,tEUTUSD,tUDCUSD,tTSDUSD,tPAXUSD,tPASUSD,tVSYUSD,tVSYBTC,tBTTUSD,tBTCUST,tETHUST,tCLOUSD,tLTCUST,tEOSUST,tGNOUSD,tATOUSD,tATOBTC,tATOETH,tWBTUSD,tXCHUSD,tEUSUSD,tLEOUSD,tLEOBTC,tLEOUST,tLEOEOS,tLEOETH,tZBTUSD,tUSKUSD,tGTXUSD,tKANUSD,tGTXUST,tKANUST,tAMPUSD,tALGUSD,tALGBTC,tALGUST,tBTCXCH,tAMPUST,tUOSUSD,tUOSBTC,tRRBUSD,tRRBUST,tAMPBTC,tFTTUSD,tFTTUST,tPAXUST,tUDCUST,tTSDUST,tCHZUSD,tCHZUST,tAAABBB,tDOGUSD,tDOGBTC,tDOGUST,tDOTUSD,tADAUSD,tADABTC,tADAUST,tFETUSD,tFETUST,tDOTUST,tKSMUSD,tKSMUST,tUNIUSD,tUNIUST,tSNXUSD,tSNXUST,tYFIUSD,tYFIUST,tBALUSD,tBALUST,tNUTUSD,tFILUSD,tFILUST,tJSTUSD,tJSTBTC,tJSTUST,tIQXUST,tHEZUSD,tHEZUST,tXDCUSD,tXDCUST,tPLUUSD,tSUNUSD,tSUNUST,tUOPUSD,tUOPUST,tEUTUST,tXMRUST,tXRPUST,tXSNUSD,tDOTBTC,tXLMUST,tEUSBTC,tCTKUSD,tCTKUST,tSOLUSD,tSOLUST,tCELUSD,tCELUST,tBMIUSD,tBMIUST,tMOBUSD,tMOBUST,tICEUSD']
function isInvalidData (data) {
  if(!data || !data.length) return true
}
const emptyMarketData: MarketData = {[Market.BITFINEX]: {'': {asks: [[]], bids: [[]]}}}

function formatData (data: [[string | number]]): MarketData {
  if(isInvalidData(data)) return emptyMarketData
  let formattedData = {}
  data[0].forEach(ticker => {
    const name = ticker[0].substring(1)
    const bids = [[ticker[1]]]
    const asks = [[ticker[3]]]
    formattedData[name] = { asks, bids }
  })

  return { [this.marketName]: formattedData }
}

const bitfinexOptions: MarketOptions = {
  marketName: Market.BITFINEX,
  baseURL: 'https://api-pub.bitfinex.com/',
  // first element is before, latter, after ticker
  // eg ['/v2','level=2'] => sample url: foo/bar/v2/BTCUTC/level=2
  urlPath: ['/v2/tickers?symbols=', ''],
  pairs: pairs,
  maxConcurrentRequests: 1,
  formatData: formatData,
}

export { bitfinexOptions }
