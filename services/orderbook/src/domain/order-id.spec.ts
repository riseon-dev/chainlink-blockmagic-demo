import { OrderId } from './order-id';

describe('OrderId', () => {
  describe('generate', () => {
    it('should return a unique number', () => {
      const first = OrderId.generate();
      const second = OrderId.generate();

      expect(first).not.toEqual(second);
    });
  });
});
