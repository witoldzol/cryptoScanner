export interface MarketOptions {
    
	marketName: string,
	baseURL: string,
	urlPath: string[],
	pairs: string[],
	maxConcurrentRequests: number,
	formatData: (data: unknown)
}