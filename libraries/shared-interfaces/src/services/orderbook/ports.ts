import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrderbookPlaceOrderDto {
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['BUY', 'SELL'])
  side: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['MARKET', 'LIMIT'])
  orderType: string;

  @IsString()
  @IsNotEmpty()
  quantity: string;

  @IsString()
  @IsOptional()
  price?: string;
}

export class OrderbookCancelOrderDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  symbol: string;
}

export class OrderbookPlaceOrderResponse {
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
