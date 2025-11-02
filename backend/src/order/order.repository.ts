import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "./order.schema";
import { CreateOrderDto } from "./types/dto/create-order.dto";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel("Order") private readonly orderModel: Model<Order>,
  ) {}

  async index(): Promise<Order[]> {
    const listedOrders = await this.orderModel.find().sort({ ordered: 1 });

    return listedOrders as Order[];
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
}
