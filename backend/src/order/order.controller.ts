import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateOrderDto } from "./types/dto/create-order.dto";
import { OrderService } from "./order.service";
import { OrderPriority } from "./types/enums/priority.enum";
import { OrderStatus } from "./types/enums/status.enum";

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

  /// UPDATE

  @Patch("/priority/:id/:priority")
  async changePriority(
    @Param("id") id: string,
    @Param("priority") priority: OrderPriority,
  ) {
    return await this.orderService.changePriority(id, priority);
  }

  @Patch("/status/:id/:status")
  async changeStatus(
    @Param("id") id: string,
    @Param("status") status: OrderStatus,
  ) {
    return await this.orderService.changeStatus(id, status);
  }

  @Patch("/confirm/:id")
  async confirmPayment(@Param("id") id: string) {
    return await this.orderService.confirmPayment(id);
  }

  @Patch("/start/:id")
  async startPreparing(@Param("id") id: string) {
    return await this.orderService.startPreparing(id);
  }

  @Patch("/finish/:id")
  async finishPreparing(@Param("id") id: string) {
    return await this.orderService.finishPreparing(id);
  }
}
