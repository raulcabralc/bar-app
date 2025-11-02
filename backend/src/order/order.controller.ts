import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CreateOrderDto } from "./types/dto/create-order.dto";
import { OrderService } from "./order.service";

@Controller("/order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("/")
  async index() {
    return await this.orderService.index();
  }

  @Get("/:id")
  async findOne(@Param("id") id: string) {
    return await this.orderService.findOne(id);
  }

  @Post("/create")
  async createOrder(@Body() order: CreateOrderDto) {
    return await this.orderService.createOrder(order);
  }

  @Delete("/delete/:id")
  async deleteOrder(@Param("id") id: string) {
    return await this.orderService.deleteOrder(id);
  }
}
