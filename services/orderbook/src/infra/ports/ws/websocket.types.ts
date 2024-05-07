export type WsEventTypes =
  | 'ping'
  | 'pong'
  | 'heartbeat'
  | 'subscribe'
  | 'unsubscribe'
  | 'trade'
  | 'ticker'
  | 'orderbook';

export type WsSubscriptionTypes =
  | 'ohlc'
  | 'ticker'
  | 'trade'
  | 'orderbook'
  | '*';

export interface WsSubscription {
  name: WsSubscriptionTypes;
  interval?: number[]; // for ohlc subscription 1|5|15|30|60|240|1440|10080|21600
}

export interface WsData {
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

export interface WsEvent {
  event: WsEventTypes;
  code?: string; // success = '0', otherwise add code
  msg?: string; // success = 'success', otherwise add message
  pairs?: string[];
  subscription?: WsSubscription;
  data?: WsData[];
}
