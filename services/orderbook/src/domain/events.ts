import { OrderSide } from './orderbook';

export enum EventType {
  ORDER_OPENED = 'ORDER_OPENED',
  ORDER_CANCELED = 'ORDER_CANCELED',
  ORDER_FILLED = 'ORDER_FILLED',
  TRADE = 'TRADE',
}

export interface Event {
  orderId: number;
  timestamp: number;
  side?: OrderSide;
  price?: number;
  quantity?: number;
}

export class OrderOpenedEvent implements Event {
  constructor(
    public readonly orderId: number,
    public readonly timestamp: number,
    public readonly side: OrderSide,
    public readonly price: number,
    public readonly quantity: number,
  ) {}
}

export class OrderCanceledEvent implements Event {
  constructor(
    public readonly orderId: number,
    public readonly timestamp: number,
  ) {}
}

export class OrderFilledEvent implements Event {
  constructor(
    public readonly orderId: number,
    public readonly timestamp: number,
  ) {}
}

export class TradeEvent implements Event {
  constructor(
    public readonly orderId: number,
    public readonly timestamp: number,
    public readonly side: OrderSide,
    public readonly price: number,
    public readonly quantity: number,
  ) {}
}
