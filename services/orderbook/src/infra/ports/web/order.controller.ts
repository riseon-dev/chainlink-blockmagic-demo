import { Controller, Logger, Post, Req } from '@nestjs/common';
import { OrdersWorkfow } from '../../../application/orders.workfow';
import {
  CancelOrderRequest,
  CancelOrderResponse,
  PlaceOrderRequest,
  PlaceOrderResponse,
} from '../../../__generated__/orderbook';

@Controller('order')
export class OrderController {
  private logger: Logger = new Logger(OrderController.name);
  constructor(private readonly ordersWorkflow: OrdersWorkfow) {}

  @Post('/place')
  place(@Req() request: PlaceOrderRequest): Promise<PlaceOrderResponse> {
    this.logger.log(`placing order`);
    return this.ordersWorkflow.placeOrder(request);
  }

  @Post('/cancel')
  cancel(@Req() request: CancelOrderRequest): Promise<CancelOrderResponse> {
    this.logger.log(`cancelling order`);
    return this.ordersWorkflow.cancelOrder(request);
  }
}
