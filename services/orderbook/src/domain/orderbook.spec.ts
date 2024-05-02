import { Order, Orderbook, OrderSide } from './orderbook';
import { EventType } from './events';

const createOrder = ({
  orderId = 1,
  timestamp = 1,
  side = OrderSide.BUY,
  price = 100,
  quantity = 10,
}: {
  orderId?: number;
  timestamp?: number;
  side?: OrderSide;
  price?: number;
  quantity?: number;
}) => {
  return {
    orderId,
    timestamp,
    side,
    price,
    quantity,
  };
};

describe('Orderbook Unit Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  // validate order tests
  describe('validate orders', () => {
    it('should not throw when all number values are integers', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const order: Order = createOrder({});
      // eslint-disable-next-line
      // @ts-ignore
      expect(() => orderbook.validateOrder(order)).not.toThrow();
    });

    it('should throw when quantity is not an integer', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const order = createOrder({
        quantity: 10.5,
      });
      // eslint-disable-next-line
      // @ts-ignore
      expect(() => orderbook.validateOrder(order)).toThrow();
    });

    it('should throw when price is not an integer', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const order = createOrder({
        price: 100.5,
      });
      // eslint-disable-next-line
      // @ts-ignore
      expect(() => orderbook.validateOrder(order)).toThrow();
    });

    it('should throw when timestamp is not an integer', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const order = createOrder({
        timestamp: 1.5,
      });
      // eslint-disable-next-line
      // @ts-ignore
      expect(() => orderbook.validateOrder(order)).toThrow();
    });

    it('should throw when quantity is less than 0', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const order = createOrder({
        quantity: -10,
      });
      // eslint-disable-next-line
      // @ts-ignore
      expect(() => orderbook.validateOrder(order)).toThrow();
    });

    it('should throw when price is less than 0', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const order = createOrder({
        price: -100,
      });
      // eslint-disable-next-line
      // @ts-ignore
      expect(() => orderbook.validateOrder(order)).toThrow();
    });

    it('should throw an error when order already exists', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const order = createOrder({});
      // eslint-disable-next-line
      // @ts-ignore
      orderbook.placeOrder(order);
      // eslint-disable-next-line
      // @ts-ignore
      expect(() => orderbook.placeOrder(order)).toThrow('Order already exists');
    });
  });

  // place order tests
  describe('place orders', () => {
    // check bid on one order
    it('should add order to bid data structures when side is BUY', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const order = createOrder({});
      orderbook.placeOrder(order);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bid_queue.get(100)).toEqual([order]);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bid_volume.get(100)).toEqual(10);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.orders.get(1)).toEqual(order);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bids.peek()).toEqual(order);
    });

    // check bid on multiple orders
    it('should add multiple order to bid data structures when side is BUY', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});

      const order1 = createOrder({});
      const order2 = createOrder({ orderId: 2, timestamp: 2, quantity: 20 });
      const order3 = createOrder({
        orderId: 3,
        timestamp: 3,
        price: 50,
        quantity: 30,
      });
      const order4 = createOrder({
        orderId: 4,
        timestamp: 4,
        price: 200,
        quantity: 40,
      });

      orderbook.placeOrder(order1);
      orderbook.placeOrder(order2);
      orderbook.placeOrder(order3);
      orderbook.placeOrder(order4);

      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bid_queue.get(100)).toEqual([order1, order2]);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bid_queue.get(50)).toEqual([order3]);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bid_queue.get(200)).toEqual([order4]);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bid_volume.get(100)).toEqual(30);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bid_volume.get(50)).toEqual(30);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bid_volume.get(200)).toEqual(40);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.orders.get(1)).toEqual(order1);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.orders.get(2)).toEqual(order2);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.orders.get(3)).toEqual(order3);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.orders.get(4)).toEqual(order4);
      // eslint-disable-next-line
      // @ts-ignore
      const value1 = orderbook.bids.pop();
      // eslint-disable-next-line
      // @ts-ignore
      const value2 = orderbook.bids.pop();
      // eslint-disable-next-line
      // @ts-ignore
      const value3 = orderbook.bids.pop();
      // eslint-disable-next-line
      // @ts-ignore
      const value4 = orderbook.bids.pop();

      expect(value1).toEqual(order4);
      expect(value2).toEqual(order2);
      expect(value3).toEqual(order1);
      expect(value4).toEqual(order3);
    });

    // check ask on one order
    it('should add order to ask data structures when side is SELL', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const order = createOrder({ side: OrderSide.SELL });
      orderbook.placeOrder(order);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.ask_queue.get(100)).toEqual([order]);
    });

    // check ask on multiple orders
    it('should add multiple order to ask data structures when side is SELL', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const order1 = createOrder({
        side: OrderSide.SELL,
      });
      const order2 = createOrder({
        orderId: 2,
        timestamp: 2,
        quantity: 20,
        side: OrderSide.SELL,
      });
      const order3 = createOrder({
        orderId: 3,
        timestamp: 3,
        price: 50,
        quantity: 30,
        side: OrderSide.SELL,
      });
      const order4 = createOrder({
        orderId: 4,
        timestamp: 4,
        price: 200,
        quantity: 40,
        side: OrderSide.SELL,
      });

      orderbook.placeOrder(order1);
      orderbook.placeOrder(order2);
      orderbook.placeOrder(order3);
      orderbook.placeOrder(order4);

      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.ask_queue.get(100)).toEqual([order1, order2]);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.ask_queue.get(50)).toEqual([order3]);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.ask_queue.get(200)).toEqual([order4]);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.ask_volume.get(100)).toEqual(30);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.ask_volume.get(50)).toEqual(30);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.ask_volume.get(200)).toEqual(40);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.orders.get(1)).toEqual(order1);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.orders.get(2)).toEqual(order2);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.orders.get(3)).toEqual(order3);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.orders.get(4)).toEqual(order4);
      // eslint-disable-next-line
      // @ts-ignore
      const value1 = orderbook.asks.pop();
      // eslint-disable-next-line
      // @ts-ignore
      const value2 = orderbook.asks.pop();
      // eslint-disable-next-line
      // @ts-ignore
      const value3 = orderbook.asks.pop();
      // eslint-disable-next-line
      // @ts-ignore
      const value4 = orderbook.asks.pop();

      expect(value1).toEqual(order3);
      expect(value2).toEqual(order2);
      expect(value3).toEqual(order1);
      expect(value4).toEqual(order4);
    });

    // check part-filled BUY order
    it('should part fill a BUY order when a SELL order is placed', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const buyOrder = createOrder({});
      orderbook.placeOrder(buyOrder);
      const sellOrder = createOrder({
        orderId: 2,
        timestamp: 2,
        quantity: 5,
        side: OrderSide.SELL,
      });
      orderbook.placeOrder(sellOrder);

      // eslint-disable-next-line
      // @ts-ignore
      const asks = orderbook.asks.toArray();
      expect(asks).toEqual([]);
      // eslint-disable-next-line
      // @ts-ignore
      const bids = orderbook.bids.toArray();
      expect(bids).toEqual([
        {
          orderId: 1,
          timestamp: 1,
          side: OrderSide.BUY,
          price: 100,
          quantity: 5,
        },
      ]);
    });

    // check fully-filled BUY order
    it('should fully fill a BUY order when a SELL order is placed', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});

      const buyOrder = createOrder({});
      orderbook.placeOrder(buyOrder);
      const sellOrder = createOrder({
        orderId: 2,
        timestamp: 2,
        quantity: 10,
        side: OrderSide.SELL,
      });

      orderbook.placeOrder(sellOrder);

      // eslint-disable-next-line
      // @ts-ignore
      const asks = orderbook.asks.toArray();
      expect(asks).toEqual([]);
      // eslint-disable-next-line
      // @ts-ignore
      const bids = orderbook.bids.toArray();
      expect(bids).toEqual([]);
    });

    // check part-filled SELL order

    it('should part fill a SELL order when a BUY order is placed', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});

      const sellOrder = createOrder({
        side: OrderSide.SELL,
      });
      orderbook.placeOrder(sellOrder);
      const buyOrder = createOrder({
        orderId: 2,
        timestamp: 2,
        quantity: 5,
        side: OrderSide.BUY,
      });
      orderbook.placeOrder(buyOrder);

      // eslint-disable-next-line
      // @ts-ignore
      const asks = orderbook.asks.toArray();
      expect(asks).toEqual([
        {
          orderId: 1,
          timestamp: 1,
          side: OrderSide.SELL,
          price: 100,
          quantity: 5,
        },
      ]);
      // eslint-disable-next-line
      // @ts-ignore
      const bids = orderbook.bids.toArray();
      expect(bids).toEqual([]);
    });

    // check fully-filled SELL order

    it('should fully fill a SELL order when a BUY order is placed', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const sellOrder = createOrder({ side: OrderSide.SELL });
      orderbook.placeOrder(sellOrder);
      const buyOrder = createOrder({
        orderId: 2,
        timestamp: 2,
        quantity: 10,
        side: OrderSide.BUY,
      });

      orderbook.placeOrder(buyOrder);

      // eslint-disable-next-line
      // @ts-ignore
      const asks = orderbook.asks.toArray();
      expect(asks).toEqual([]);
      // eslint-disable-next-line
      // @ts-ignore
      const bids = orderbook.bids.toArray();
      expect(bids).toEqual([]);
    });
  });

  describe('cancel orders', () => {
    it('should throw order not found when order does not exist', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});

      expect(() => orderbook.cancelOrder(1111)).toThrow('Order not found');
    });

    it('should remove order from bid data structures when side is BUY', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const order = createOrder({});
      orderbook.placeOrder(order);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bid_queue.get(100)).toBeDefined();
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bid_volume.get(100)).toEqual(10);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.orders.get(1)).toBeDefined;
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bids.toArray()).toEqual([order]);

      orderbook.cancelOrder(1);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bid_queue.get(100)).toBeUndefined();
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bid_volume.get(100)).toEqual(0);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.orders.get(1)).toBeUndefined();
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.bids.toArray()).toEqual([]);
    });

    it('should remove order from ask data structures when side is SELL', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const order = createOrder({ side: OrderSide.SELL });
      orderbook.placeOrder(order);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.ask_queue.get(100)).toBeDefined();
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.ask_volume.get(100)).toEqual(10);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.orders.get(1)).toBeDefined;
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.asks.toArray()).toEqual([order]);

      orderbook.cancelOrder(1);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.ask_queue.get(100)).toBeUndefined();
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.ask_volume.get(100)).toEqual(0);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.orders.get(1)).toBeUndefined();
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.asks.toArray()).toEqual([]);
    });
  });

  describe('get volume at price', () => {
    it('should return 0 when price does not exist', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.getVolumeAtPrice(100, OrderSide.BUY)).toEqual(0);
    });

    it('should return volume when price exists', () => {
      const orderbook = new Orderbook('WBTC', 'USDT', () => {});
      const order = createOrder({});
      orderbook.placeOrder(order);
      // eslint-disable-next-line
      // @ts-ignore
      expect(orderbook.getVolumeAtPrice(100, OrderSide.BUY)).toEqual(10);
    });
  });

  // check emitted events
  describe('emitted events', () => {
    it('should emit ORDER_OPENED event when order is placed', () => {
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
      const eventHandler = jest.fn();
      const orderbook = new Orderbook('WBTC', 'USDT', eventHandler);
      const order = createOrder({});
      orderbook.placeOrder(order);
      expect(eventHandler).toHaveBeenCalledWith(EventType.ORDER_OPENED, {
        orderId: 1,
        timestamp: 1577836800000,
        side: OrderSide.BUY,
        price: 100,
        quantity: 10,
      });
    });

    it('should emit ORDER_CANCELED event when order is canceled', () => {
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
      const eventHandler = jest.fn();
      const orderbook = new Orderbook('WBTC', 'USDT', eventHandler);
      const order = createOrder({});
      orderbook.placeOrder(order);
      orderbook.cancelOrder(1);
      expect(eventHandler).toHaveBeenCalledWith(EventType.ORDER_CANCELED, {
        orderId: 1,
        timestamp: 1577836800000,
      });
    });

    it('should emit ORDER_FILLED event when order is fully filled', () => {
      const eventHandler = jest.fn();
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
      const orderbook = new Orderbook('WBTC', 'USDT', eventHandler);
      const buyOrder = createOrder({});
      orderbook.placeOrder(buyOrder);
      const sellOrder = createOrder({
        orderId: 2,
        timestamp: 2,
        quantity: 10,
        side: OrderSide.SELL,
      });
      orderbook.placeOrder(sellOrder);
      expect(eventHandler).toHaveBeenCalledWith(EventType.ORDER_FILLED, {
        orderId: 1,
        timestamp: 1577836800000,
      });
    });

    it('should emit TRADE event when order is partially filled', () => {
      const eventHandler = jest.fn();
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
      const orderbook = new Orderbook('WBTC', 'USDT', eventHandler);
      const buyOrder = createOrder({});
      orderbook.placeOrder(buyOrder);
      const sellOrder = createOrder({
        orderId: 2,
        timestamp: 2,
        quantity: 5,
        side: OrderSide.SELL,
      });
      orderbook.placeOrder(sellOrder);
      expect(eventHandler).toHaveBeenNthCalledWith(2, EventType.TRADE, {
        orderId: 2,
        side: 'SELL',
        price: 100,
        quantity: 5,
        timestamp: 1577836800000,
      });
    });
  });
});
