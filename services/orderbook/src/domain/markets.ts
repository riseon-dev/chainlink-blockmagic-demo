export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}

export enum MARKETS {
  LINK_USDT = 'LINK/USDT',
}

export type MarketInfo = {
  symbol: string;
  base: string;
  quote: string;
  orderTypes: OrderType[];
  basePrecision: number;
  quotePrecision: number;
  minTradeAmount: number;
  maxTradeAmount: number;
};

export const MarketSymbols = new Map<string, MarketInfo>();

MarketSymbols.set(MARKETS.LINK_USDT, {
  symbol: 'LINK/USDT',
  base: 'LINK',
  quote: 'USDT',
  orderTypes: [OrderType.LIMIT],
  basePrecision: 4,
  quotePrecision: 4,
  minTradeAmount: 0.0001,
  maxTradeAmount: 1_000_000,
});
