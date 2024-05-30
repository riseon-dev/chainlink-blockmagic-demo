import { Controller, Get, Query } from '@nestjs/common';
import { TradeLogWorkflow } from '../../../../application/trade-log.workflow';
import { IsOptional, IsString } from 'class-validator';

export class GetTradeLogQueryDto {
  @IsString()
  @IsOptional()
  offset?: string;

  @IsString()
  @IsOptional()
  limit?: string;
}

@Controller('tradelog')
export class TradeLogController {
  constructor(private readonly tradeLogWorkflow: TradeLogWorkflow) {}

  @Get()
  tradelog(@Query() params: GetTradeLogQueryDto) {
    const offset = params.offset ? +params.offset : undefined;
    const limit = params.limit ? +params.limit : undefined;
    return this.tradeLogWorkflow.getTradeLog(offset, limit);
  }
}
