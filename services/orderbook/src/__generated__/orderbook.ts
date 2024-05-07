/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "orderbook_api";

export enum OrderSide {
  SIDE_UNSPECIFIED = 0,
  SIDE_BUY = 1,
  SIDE_SELL = 2,
  UNRECOGNIZED = -1,
}

export enum OrderType {
  TYPE_UNSPECIFIED = 0,
  TYPE_LIMIT = 1,
  /**
   * TYPE_MARKET - TYPE_STOP = 3;
   *  TYPE_STOP_LIMIT = 4;
   *  TYPE_TAKE_PROFIT = 5;
   *  TYPE_TAKE_PROFIT_LIMIT = 6;
   *  TYPE_LIMIT_MAKER = 7;
   */
  TYPE_MARKET = 2,
  UNRECOGNIZED = -1,
}

export interface PlaceOrderRequest {
  symbol: string;
  side: OrderSide;
  orderType: OrderType;
  quantity: string;
  price?: string | undefined;
}

export interface PlaceOrderResponse {
  orderId: string;
}

export interface CancelOrderRequest {
  orderId: string;
  symbol: string;
}

export interface CancelOrderResponse {
  success: boolean;
}

export const ORDERBOOK_API_PACKAGE_NAME = "orderbook_api";

export interface OrderbookServiceClient {
  placeOrder(request: PlaceOrderRequest, metadata?: Metadata): Observable<PlaceOrderResponse>;

  cancelOrder(request: CancelOrderRequest, metadata?: Metadata): Observable<CancelOrderResponse>;
}

export interface OrderbookServiceController {
  placeOrder(
    request: PlaceOrderRequest,
    metadata?: Metadata,
  ): Promise<PlaceOrderResponse> | Observable<PlaceOrderResponse> | PlaceOrderResponse;

  cancelOrder(
    request: CancelOrderRequest,
    metadata?: Metadata,
  ): Promise<CancelOrderResponse> | Observable<CancelOrderResponse> | CancelOrderResponse;
}

export function OrderbookServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["placeOrder", "cancelOrder"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("OrderbookService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("OrderbookService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ORDERBOOK_SERVICE_NAME = "OrderbookService";
