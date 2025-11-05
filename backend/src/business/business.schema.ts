import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { OrderItem } from "src/order/types/interfaces/item.interface";
import { WeekDay } from "./types/enums/week-day.enum";
import { ItemsDenormalized } from "./types/interfaces/items-denormalized.interface";
import { Origin } from "src/order/types/enums/origin.enum";
import { OrderType } from "src/order/types/enums/type.enum";

@Schema()
export class Business {
  @Prop({ required: true })
  originalOrderId: string;

  /// DATA

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  weekDay: WeekDay;

  @Prop({ required: true })
  hourSlot: string;

  /// FINANCEIRO

  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  discount: number;

  @Prop({ required: false })
  deliveryFee?: number;

  @Prop({ required: true })
  total: number;

  @Prop({ required: false })
  customerCount?: number;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ required: true })
  origin: Origin;

  /// ESTOQUE & PRODUTO

  @Prop({ required: true })
  itemsDenormalized: ItemsDenormalized[];

  @Prop({ required: true })
  totalItemsCount: number;

  /// DESEMPENHO DOS FUNCIONÁRIOS & LOGÍSTICA

  @Prop({ required: true })
  timeToStartPreparing: number;

  @Prop({ required: true })
  timePreparing: number;

  @Prop({ required: true })
  orderType: OrderType;

  @Prop({ required: false })
  timeToDelivery?: number;

  @Prop({ required: true })
  waiterId: string;

  @Prop({ required: true })
  waiterName: string;

  @Prop({ required: false })
  transactionHandlerId?: string;

  @Prop({ required: false })
  transactionHandlerName?: string;

  @Prop({ required: false })
  deliveryNeighborhood?: string;

  @Prop({ required: true })
  isCanceled: boolean;

  @Prop({ required: false })
  cancellationReason?: string;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
