import { Body, Controller, Logger, Post } from '@nestjs/common';
import { OrdersWorkfow } from '../../../../application/orders.workfow';
import {
  OrderbookPlaceOrderDto,
  OrderbookCancelOrderDto,
} from '@haru/shared-interfaces';

@Controller('order')
export class OrderController {
  private logger: Logger = new Logger(OrderController.name);
  constructor(private readonly ordersWorkflow: OrdersWorkfow) {}

  @Post('/place')
  place(@Body() request: OrderbookPlaceOrderDto): Promise<{ orderId: string }> {
    this.logger.log(`placing order`);
    const order = {
      //orderId: request.orderId,
      symbol: request.symbol,
      price: request.price ?? '',
      quantity: request.quantity,
      side: request.side,
      orderType: request.orderType,
    };

    return this.ordersWorkflow.placeOrder(order);
  }

  @Post('/cancel')
  cancel(
    @Body() request: OrderbookCancelOrderDto,
  ): Promise<{ success: boolean }> {
    this.logger.log(`cancelling order`);
    return this.ordersWorkflow.cancelOrder(request.orderId, request.symbol);
  }
}
