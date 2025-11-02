import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { CreateOrderDto } from "./types/dto/create-order.dto";
import { OrderType } from "./types/enums/type.enum";
import { OrderStatus } from "./types/enums/status.enum";
import { Order } from "./order.schema";
import type { OrderReturn } from "./types/interfaces/success.interface";

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async index() {
    return await this.orderRepository.index();
  }

  async findOne(id: string): Promise<Order | OrderReturn> {
    const order = await this.orderRepository.findOne(id);

    if (!order)
      return {
        success: false,
        message: `Order with id ${id} not found.`,
      };

    return order;
  }

  async createOrder(order: CreateOrderDto): Promise<Order | OrderReturn> {
    const missingFields: string[] = [];

    const requiredFields = [
      "priority",
      "number",
      "items",
      "type",
      "waiter",
      "subtotal",
      "paymentMethod",
      "origin",
    ];

    const addressFields = [
      "cep",
      "street",
      "number",
      "neighborhood",
      "city",
      "complement",
    ];

    const otherFields = [
      "id",
      "status",
      "ordered",
      "tableName",
      "address",
      "change",
      "isPaid",
      "startedPreparing",
      "finishedPreparing",
    ];

    for (const field of requiredFields) {
      if (!order[field] && !otherFields.includes(field)) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `missing required fields: ${missingFields.join(", ")}`,
      };
    }

    if (!order.tableNumber && !order.address) {
      if (order.type === OrderType.TABLE) {
        return {
          success: false,
          message: "tableNumber is required for table orders.",
        };
      } else {
        return {
          success: false,
          message: "address is required for delivery orders.",
        };
      }
    }

    if (order.address && order.tableNumber) {
      if (order.type === OrderType.TABLE) {
        return {
          success: false,
          message: "address should not be provided for table orders.",
        };
      }
    }

    const missingAddressFields: string[] = [];

    if (order.address) {
      for (const field of addressFields) {
        if (!order.address[field]) {
          missingAddressFields.push(field);
        }
      }
    }

    if (missingAddressFields.length > 0) {
      return {
        success: false,
        message: `missing required address fields: ${missingAddressFields.join(", ")}`,
      };
    }

    order = {
      ...order,
      status: OrderStatus.PENDING,
      ordered: new Date(),
      change: parseFloat((order.amountPaid - order.total).toFixed(2)),
      isPaid: false,
      startedPreparing: null,
      finishedPreparing: null,
    };

    return this.orderRepository.createOrder(order);
  }

  async deleteOrder(id: string): Promise<Order | OrderReturn> {
    const deletedOrder = await this.orderRepository.deleteOrder(id);

    if (!deletedOrder)
      return {
        success: false,
        message: `Order with id ${id} not found.`,
      };

    return deletedOrder;
  }
}
