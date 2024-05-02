import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PlaceOrderDto {
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

export class CancelOrderDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  symbol: string;
}
