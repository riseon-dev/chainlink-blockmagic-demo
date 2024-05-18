export interface KrakenWebsocketMessageSubscription {
  depth?: number;
  interval?: number;
  name:
    | 'book'
    | 'ohlc'
    | 'openOrders'
    | 'ownTrades'
    | 'spread'
    | 'ticker'
    | 'trade'
    | '*';
  ratecounter?: boolean;
  snapshot?: boolean;
  token?: string;
  consolidate_taker?: boolean;
  maxratecount?: number;
}

export interface KrakenWebsocketMessage {
  event:
    | 'error'
    | 'ping'
    | 'pong'
    | 'heartbeat'
    | 'systemStatus'
    | 'subscribe'
    | 'unsubscribe'
    | 'subscriptionStatus'
    | 'ticker';
  reqid?: number;
  errorMessage?: string;

  connectionID?: number;
  status?:
    | 'online'
    | 'maintenance'
    | 'cancel_only'
    | 'limit_only'
    | 'post_only';
  version?: string;

  pair?: string | string[];
  subscription?: KrakenWebsocketMessageSubscription;

  OneOf?: {
    errorMessage: string;
    channelID: number;
  };

  channelName?: string;
  channelID?: number; // deprecated
}
