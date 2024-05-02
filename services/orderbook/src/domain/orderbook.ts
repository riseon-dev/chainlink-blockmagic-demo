import { Heap } from 'heap-js';

export enum OrderSide {
  BUY = 'buy',
  SELL = 'sell',
}

export interface Order {
  orderId: number;
  timestamp: number;
  side: OrderSide;
  price: number;
  quantity: number;
}

export class Orderbook {
  public readonly symbol: string;

  private readonly asks: Heap<Order>; // min heap, best asks is at the top
  private readonly bids: Heap<Order>; // max heap, best bids is at the top
  private orders: Map<number, Order>; // orderId, order
  private readonly ask_volume: Map<number, number>; // price, volume
  private readonly ask_queue: Map<number, Order[]>; // price, list of orders
  private readonly bid_volume: Map<number, number>; // price, volume
  private readonly bid_queue: Map<number, Order[]>; // price, list of orders

  constructor(
    public readonly base: string,
    public readonly quote: string,
  ) {
    this.symbol = `${base}/${quote}`;
    const asksComparator = (a: Order, b: Order) => a.price - b.price;
    const bidComparator = (a: Order, b: Order) => b.price - a.price;
    this.asks = new Heap<Order>(asksComparator);
    this.bids = new Heap<Order>(bidComparator);
    this.orders = new Map<number, Order>();
    this.ask_volume = new Map<number, number>();
    this.ask_queue = new Map<number, Order[]>();
    this.bid_volume = new Map<number, number>();
    this.bid_queue = new Map<number, Order[]>();
  }

  private validateOrder(order: Order): void {
    // for faster calculations we use integer at this point
    // convert to decimal when outputting from clients
    if (!Number.isInteger(order.price))
      throw new Error('price should be an integer');
    if (!Number.isInteger(order.quantity))
      throw new Error('quantity should be an integer');
    if (!Number.isInteger(order.orderId))
      throw new Error('orderId should be an integer');
    if (!Number.isInteger(order.timestamp))
      throw new Error('timestamp should be an integer');

    if (order.orderId < 0) throw new Error('orderId should be greater than 0');
    if (order.timestamp < 0)
      throw new Error('timestamp should be greater than 0');
    if (this.orders.get(order.orderId)) throw new Error('Order already exists');

    if (order.quantity <= 0 || order.price <= 0)
      throw new Error('quantity and price should be greater than 0');
  }

  private getBook(side: OrderSide): Heap<Order> {
    return side === OrderSide.BUY ? this.bids : this.asks;
  }

  private getVolumeMap(side: OrderSide): Map<number, number> {
    return side === OrderSide.BUY ? this.bid_volume : this.ask_volume;
  }

  private getQueueMap(side: OrderSide): Map<number, Order[]> {
    return side === OrderSide.BUY ? this.bid_queue : this.ask_queue;
  }

  private addOrderToBook(order: Order): void {
    const book = this.getBook(order.side);
    const volumeMap = this.getVolumeMap(order.side);
    const queueMap = this.getQueueMap(order.side);

    book.push(order);

    if (!queueMap.has(order.price)) {
      queueMap.set(order.price, [order]);
      volumeMap.set(order.price, order.quantity);
    } else {
      const orderArray = queueMap.get(order.price);
      if (orderArray) orderArray.push(order);
      const value = volumeMap.get(order.price) ?? 0;
      volumeMap.set(order.price, value + order.quantity);
    }
  }

  private removeOrderFromBook(order: Order) {
    if (!order) throw new Error('order not found');

    const book = this.getBook(order.side);
    const volumeMap = this.getVolumeMap(order.side);
    const queueMap = this.getQueueMap(order.side);

    const orderArray = queueMap.get(order.price);
    if (!orderArray) throw new Error('order not found in queue');

    const index = orderArray.findIndex((o) => o.orderId === order.orderId);
    if (index === -1) throw new Error('order not found in queue');

    const removedOrder = orderArray.splice(index, 1)[0];
    const value = volumeMap.get(removedOrder.price) ?? 0;
    volumeMap.set(removedOrder.price, value - removedOrder.quantity);

    if (orderArray.length === 0) {
      queueMap.delete(removedOrder.price);
    }

    book.remove(removedOrder);
    this.orders.delete(order.orderId);
  }

  placeOrder(order: Order): number {
    this.validateOrder(order);

    const oppositeBook = order.side === OrderSide.BUY ? this.asks : this.bids;
    let toFill = order.quantity;

    this.orders.set(order.orderId, order);

    while (oppositeBook.size() > 0 && toFill !== 0) {
      // this should not be a while loop
      const otherOrder = oppositeBook.peek();
      if (!otherOrder) break;
      if (otherOrder.price > order.price) break;

      const tradePrice = otherOrder.price;
      const tradeQuantity = Math.min(otherOrder.quantity, order.quantity);
      otherOrder.quantity -= tradeQuantity;
      order.quantity -= tradeQuantity;
      toFill -= tradeQuantity;
      console.log(
        `order filled tradePrice: ${tradePrice}, tradeQuantity: ${tradeQuantity}`,
      );
      // TODO emit part filled here

      if (otherOrder.quantity === 0) {
        this.removeOrderFromBook(otherOrder);
        // TODO emit order filled and removed event here.
      }
    }

    if (order.quantity > 0) {
      this.addOrderToBook(order);
      // TODO emit order placed event here.
    }

    return order.orderId;
  }

  cancelOrder(orderId: number): boolean {
    const order = this.orders.get(orderId);
    if (order) {
      this.removeOrderFromBook(order);
      // TODO emit order cancelled event here.
      return true;
    }
    throw new Error('Order not found');
  }

  getVolumeAtPrice(price: string, side: OrderSide): number {
    if (side === OrderSide.BUY) {
      return this.bid_volume.get(Number(price)) ?? 0;
    } else {
      return this.ask_volume.get(Number(price)) ?? 0;
    }
  }
}
