import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersWorkfow {
  constructor() {}

  placeOrder() {
    return 'order placed';
  }

  cancelOrder() {
    return 'order cancelled';
  }
}
