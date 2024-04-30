import { Injectable, Logger } from '@nestjs/common';
import {
  CancelOrderRequest,
  CancelOrderResponse,
  PlaceOrderRequest,
  PlaceOrderResponse,
} from '../__generated__/orderbook';

@Injectable()
export class OrdersWorkfow {
  private logger: Logger = new Logger(OrdersWorkfow.name);
  constructor() {}

  placeOrder(request: PlaceOrderRequest): Promise<PlaceOrderResponse> {
    this.logger.debug(request);
    return Promise.resolve({ orderId: '123' });
  }

  cancelOrder(request: CancelOrderRequest): Promise<CancelOrderResponse> {
    this.logger.debug(request);
    return Promise.resolve({ success: true });
  }
}
