import { Address } from "../interfaces/address.interface";
import { Origin } from "../enums/origin.enum";
import { PaymentMethod } from "../enums/payment-method.enum";
import { OrderType } from "../enums/type.enum";
import { OrderItem } from "../interfaces/item.interface";
import { OrderPriority } from "../enums/priority.enum";
import { OrderStatus } from "../enums/status.enum";

export class CreateOrderDto {
  id?: string;
  priority: OrderPriority;
  number: number;
  status?: OrderStatus;
  ordered: Date;
  items: OrderItem[];
  type: OrderType;
  tableNumber?: number;
  address?: Address;
  waiterId: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  amountPaid: number;
  change?: number;
  paymentMethod: PaymentMethod;
  isPaid?: boolean;
  startedPreparing?: Date | null;
  finishedPreparing?: Date | null;
  origin: Origin;
}
