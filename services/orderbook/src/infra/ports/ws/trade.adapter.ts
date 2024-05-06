import { Injectable } from '@nestjs/common';
import { WsAdapter } from './ws.adapter';

@Injectable()
export class TradeAdapter extends WsAdapter {
  constructor() {
    super();
  }
}
