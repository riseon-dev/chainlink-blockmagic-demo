import { Body, Controller, Logger, Post } from '@nestjs/common';
import { OrdersWorkfow } from '../../../../application/orders.workfow';
import { CancelOrderDto, PlaceOrderDto } from './order.dto';

@Controller('order')
export class OrderController {
  private logger: Logger = new Logger(OrderController.name);
  constructor(private readonly ordersWorkflow: OrdersWorkfow) {}

  @Post('/place')
  place(@Body() request: PlaceOrderDto): Promise<{ orderId: string }> {
    this.logger.log(`placing order`);
    return this.ordersWorkflow.placeOrder(request);
  }

  @Post('/cancel')
  cancel(@Body() request: CancelOrderDto): Promise<{ success: boolean }> {
    this.logger.log(`cancelling order`);
    return this.ordersWorkflow.cancelOrder(request);
  }
}
