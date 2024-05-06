import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MarketInfo, MarketSymbols } from '../domain/markets';
import { OrderId } from '../domain/order-id';
import { Order, Orderbook, OrderSide } from '../domain/orderbook';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OrdersWorkfow implements OnModuleInit {
  private logger: Logger = new Logger(OrdersWorkfow.name);
  private orderbooks = new Map<string, Orderbook>();

  constructor(private readonly eventEmitter: EventEmitter2) {}

  onModuleInit() {
    for (const market of MarketSymbols.values()) {
      const base = market.base;
      const quote = market.quote;
      this.orderbooks.set(
        market.symbol,
        new Orderbook(
          base,
          quote,
          this.eventEmitter.emit.bind(this.eventEmitter),
        ),
      );
    }
  }

  private countDecimals(value: string): number {
    if (Math.floor(+value) === +value) return 0;
    return value.split('.')[1].length || 0;
  }

  private validateOrder({
    price,
    quantity,
    market,
  }: {
    price: string;
    quantity: string;
    market: MarketInfo;
  }): void {
    if (+quantity < market.minTradeAmount)
      throw new Error('quantity is less than minTradeAmount');
    if (+quantity > market.maxTradeAmount)
      throw new Error('quantity is more than maxTradeAmount');
    if (+price <= 0) throw new Error('price should be greater than 0');
    const priceDecimals = this.countDecimals(price);
    const quantityDecimals = this.countDecimals(quantity);
    if (priceDecimals > market.quotePrecision)
      throw new Error('price has more decimals than quotePrecision');
    if (quantityDecimals > market.basePrecision)
      throw new Error('quantity has more decimals than basePrecision');
  }

  placeOrder({
    symbol,
    side,
    price,
    quantity,
    orderType,
  }: {
    symbol: string;
    side: string;
    price: string;
    quantity: string;
    orderType: string;
  }): Promise<{ orderId: string }> {
    this.logger.debug(`placing order: ${symbol} ${side} ${price} ${quantity}`);
    if (orderType === 'MARKET') {
      return Promise.reject('Market orders are not supported');
    }

    const market = MarketSymbols.get(symbol);
    if (!market) throw new Error('Market not found');

    // validate order based on market values
    this.validateOrder({ price, quantity, market });

    const orderId = OrderId.generate();
    const basePrecision = 10 ** market.basePrecision;
    const quotePrecision = 10 ** market.quotePrecision;
    const adjustedPrice = +price * quotePrecision;
    const adjustedQuantity = +quantity * basePrecision;

    const order: Order = {
      orderId,
      symbol,
      timestamp: Date.now(),
      side: side === 'BUY' ? OrderSide.BUY : OrderSide.SELL,
      price: adjustedPrice,
      quantity: adjustedQuantity,
    };
    const orderbook = this.orderbooks.get(symbol);
    if (!orderbook) throw new Error('Orderbook not found');

    const response = orderbook.placeOrder(order);

    return Promise.resolve({ orderId: response.toString() });
  }

  cancelOrder(orderId: string, symbol: string): Promise<{ success: boolean }> {
    const orderbook = this.orderbooks.get(symbol);
    if (!orderbook) throw new Error('Orderbook not found');

    const response = orderbook.cancelOrder(+orderId);

    return Promise.resolve({ success: response });
  }
}
