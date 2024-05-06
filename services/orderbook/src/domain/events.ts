import { OrderSide } from './orderbook';

export enum EventType {
  ORDER_OPENED = 'ORDER_OPENED',
  ORDER_CANCELED = 'ORDER_CANCELED',
  ORDER_FILLED = 'ORDER_FILLED',
  TRADE = 'TRADE',
}

export interface DomainEvent {
  orderId?: number;
  timestamp: number;
  symbol?: string;
  side?: OrderSide;
  price?: number;
  quantity?: number;
}

export class OrderOpenedEvent implements DomainEvent {
  constructor(
    public readonly orderId: number,
    public readonly symbol: string,
    public readonly timestamp: number,
    public readonly side: OrderSide,
    public readonly price: number,
    public readonly quantity: number,
  ) {}
}

export class OrderCanceledEvent implements DomainEvent {
  constructor(
    public readonly orderId: number,
    public readonly timestamp: number,
  ) {}
}

export class OrderFilledEvent implements DomainEvent {
  constructor(
    public readonly orderId: number,
    public readonly timestamp: number,
  ) {}
}

export class TradeEvent implements DomainEvent {
  constructor(
    public readonly timestamp: number,
    public readonly symbol: string,
    public readonly side: OrderSide,
    public readonly price: number,
    public readonly quantity: number,
  ) {}
}
