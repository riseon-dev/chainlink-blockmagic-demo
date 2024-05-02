import { Injectable, Logger } from '@nestjs/common';
import {
  CancelOrderDto,
  PlaceOrderDto,
} from '../infra/ports/web/order/order.dto'; // FIXME remove and replace with domain types

// TODO use https://www.npmjs.com/package/heap-js
// https://www.youtube.com/watch?v=nmYx6tQxtSs
// https://github.com/haru-exchange/chainlink-demo/issues/4

@Injectable()
export class OrdersWorkfow {
  private logger: Logger = new Logger(OrdersWorkfow.name);
  constructor() {}

  placeOrder(request: PlaceOrderDto): Promise<{ orderId: string }> {
    this.logger.debug(JSON.stringify(request));
    return Promise.resolve({ orderId: '123' });
  }

  cancelOrder(request: CancelOrderDto): Promise<{ success: boolean }> {
    this.logger.debug(JSON.stringify(request));
    return Promise.resolve({ success: true });
  }
}
