export type OrderbookWsEventTypes =
  | 'ping'
  | 'pong'
  | 'heartbeat'
  | 'subscribe'
  | 'unsubscribe'
  | 'trade'
  | 'ticker'
  | 'orderbook';

export type OrderbookWsSubscriptionTypes =
  | 'ohlc'
  | 'ticker'
  | 'trade'
  | 'orderbook'
  | '*';

export interface OrderbookWsSubscription {
  name: OrderbookWsSubscriptionTypes;
  interval?: number[]; // for ohlc subscription 1|5|15|30|60|240|1440|10080|21600
}

export interface OrderbookWsData {
  symbol: string;
  ts: number;
  type: 'update' | 'snapshot';

  // ticker (every 100ms)
  bestBid?: string;
  bestAsk?: string;
  bestBidSize?: string;
  bestAskSize?: string;
  baseVolume?: string;
  quoteVolume?: string;
  lastTradedPrice?: string;
  lastTradedSize?: string;

  // ohlc
  open?: string;
  high?: string;
  low?: string;
  close?: string;
  volume?: string;

  // trade (when a trade happens)
  tradePrice?: string;
  tradeVolume?: string;
  tradeSide?: string;

  // orderbook (every 100ms)
  asks?: [string, string][];
  bids?: [string, string][];
}

export interface OrderbookWsEvent {
  event: OrderbookWsEventTypes;
  code?: string; // success = '0', otherwise add code
  msg?: string; // success = 'success', otherwise add message
  pairs?: string[];
  subscription?: OrderbookWsSubscription;
  data?: OrderbookWsData[];
}
