import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "./order.schema";
import { CreateOrderDto } from "./types/dto/create-order.dto";
import { OrderPriority } from "./types/enums/priority.enum";
import { OrderStatus } from "./types/enums/status.enum";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel("Order") private readonly orderModel: Model<Order>,
  ) {}

  async index(): Promise<Order[]> {
    const listedOrders = await this.orderModel.find().sort({ ordered: 1 });

    return listedOrders as Order[];
  }

  async indexDay(): Promise<Order[]> {
    const todayOrders = await this.orderModel.find({
      ordered: {
        $gte: new Date(new Date().setHours(0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59)),
      },
    });

    return todayOrders as Order[];
  }

  async findOne(id: string): Promise<Order | null> {
    const foundOrder = await this.orderModel.findById(id);

    return foundOrder as Order;
  }

  async createOrder(order: CreateOrderDto): Promise<Order> {
    const createdOrder = await this.orderModel.create(order);

    return createdOrder as Order;
  }

  async deleteOrder(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id);

    return deletedOrder as Order;
  }

  /// UPDATE

  async changePriority(id: string, priority: OrderPriority): Promise<Order> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      {
        priority,
      },
      { new: true },
    );

    return updatedOrder as Order;
  }

  async changeStatus(id: string, status: OrderStatus): Promise<Order> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true },
    );

    return updatedOrder as Order;
  }

  async confirmPayment(id: string): Promise<Order> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      {
        isPaid: true,
      },
      { new: true },
    );

    return updatedOrder as Order;
  }

  async startPreparing(id: string, startPreparing: Date): Promise<Order> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      {
        startedPreparing: startPreparing,
        status: OrderStatus.PREPARING,
      },
      { new: true },
    );

    return updatedOrder as Order;
  }

  async finishPreparing(id: string, finishPreparing: Date): Promise<Order> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      {
        finishedPreparing: finishPreparing,
      },
      { new: true },
    );

    return updatedOrder as Order;
  }

  async setTransactionHandler(
    waiterId: string,
    waiterName: string,
    orderId: string,
  ): Promise<Order> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      {
        transactionHandlerId: waiterId,
        transactionHandlerName: waiterName,
      },
      { new: true },
    );

    return updatedOrder as Order;
  }
}
