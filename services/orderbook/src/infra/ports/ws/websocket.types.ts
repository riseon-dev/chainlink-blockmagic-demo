export type WsEventTypes =
  | 'ping'
  | 'pong'
  | 'heartbeat'
  | 'subscribe'
  | 'unsubscribe';

export type WsSubscriptionTypes = 'ohlc' | 'ticker' | 'trade' | '*';

export interface WsSubscription {
  name: WsSubscriptionTypes;
  interval?: number[]; // for ohlc subscription 1|5|15|30|60|240|1440|10080|21600
}

export interface WsData {
  symbol: string;
  ts: number;
  type: 'update' | 'snapshot';
  // ticker
  bestBid?: string;
  bestAsk?: string;
  bestBidSize?: string;
  bestAskSize?: string;
  baseVolume?: string;
  quoteVolume?: string;
  // ohlc
  open?: string;
  high?: string;
  low?: string;
  close?: string;
  volume?: string;
  // trade
  tradePrice?: string;
  tradeVolume?: string;
  tradeSide?: string;
}

export interface WsEvent {
  event: WsEventTypes;
  code?: string; // success = '0', otherwise add code
  msg?: string; // success = 'success', otherwise add message
  pairs?: string[];
  subscription?: WsSubscription;
  data?: WsData[];
}
