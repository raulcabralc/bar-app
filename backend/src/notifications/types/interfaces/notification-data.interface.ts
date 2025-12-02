import { Order } from "src/order/order.schema";
import { CreateOrderDto } from "src/order/types/dto/create-order.dto";
import { OrderPriority } from "src/order/types/enums/priority.enum";

export interface NotificationData {
  orderId?: string;
  orderData?: Order | CreateOrderDto;
  message?: string;
  priority?: OrderPriority;
}
