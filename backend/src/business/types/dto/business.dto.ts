import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { WeekDay } from "../enums/week-day.enum";
import { ItemsDenormalized } from "../interfaces/items-denormalized.interface";
import { PaymentMethod } from "src/order/types/enums/payment-method.enum";
import { OrderType } from "src/order/types/enums/type.enum";
import { Origin } from "src/order/types/enums/origin.enum";

export class BusinessDTO {
  @IsString()
  originalOrderId: string;

  @IsDateString()
  date: string;

  @IsString()
  weekDay: WeekDay;

  @IsString()
  hourSlot: string;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  discount: number;

  @IsOptional()
  @IsNumber()
  deliveryFee?: number;

  @IsNumber()
  total: number;

  @IsOptional()
  @IsNumber()
  customerCount?: number;

  @IsString()
  paymentMethod: PaymentMethod;

  @IsString()
  origin: Origin;

  @IsArray()
  itemsDenormalized: ItemsDenormalized[];

  @IsNumber()
  totalItemsCount: number;

  @IsString()
  waiterId: string;

  @IsString()
  waiterName: string;

  @IsOptional()
  @IsString()
  transactionHandlerId?: string;

  @IsOptional()
  @IsString()
  transactionHandlerName?: string;

  @IsNumber()
  timePreparing: number;

  @IsString()
  orderType: OrderType;

  @IsNumber()
  timeToStartPreparing: number;

  @IsOptional()
  @IsNumber()
  timeToDelivery?: number;

  @IsOptional()
  @IsString()
  deliveryNeighborhood?: string;

  @IsBoolean()
  isCanceled: boolean;

  @IsOptional()
  @IsString()
  cancellationReason?: string;
}
