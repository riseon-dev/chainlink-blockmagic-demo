import { Controller, Post } from '@nestjs/common';
import { OrdersWorkfow } from '../../../application/orders.workfow';

@Controller('order')
export class OrderController {
  constructor(private readonly ordersWorkflow: OrdersWorkfow) {}

  @Post('/place')
  place(): string {
    console.log(`placing order`);
    return this.ordersWorkflow.placeOrder();
  }

  @Post('/cancel')
  cancel(): string {
    console.log(`cancelling order`);
    return this.ordersWorkflow.cancelOrder();
  }
}
