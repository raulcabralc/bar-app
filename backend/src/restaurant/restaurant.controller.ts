import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { CreateRestaurantDTO } from "./types/dto/create-restaurant.dto";
import { Restaurant } from "./restaurant.schema";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import type { Request } from "express";

@Controller("/restaurant")
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // APAGAR DEPOIS
  @Get("/")
  async index() {
    return await this.restaurantService.index();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  async findOne(@Param("id") id: string, @Req() req: Request) {
    if (!req.user)
      throw new BadRequestException("Log in before using this route");

    return await this.restaurantService.findOne(id);
  }

  @Post("/create")
  async create(@Body() restaurant: CreateRestaurantDTO) {
    return await this.restaurantService.create(restaurant);
  }

  @Patch("/update/:id")
  async update(
    @Param("id") id: string,
    @Body() restaurant: Partial<Restaurant>,
  ) {
    return await this.restaurantService.update(id, restaurant);
  }

  @Delete("/delete/:id")
  async delete(@Param("id") id: string) {
    return await this.restaurantService.delete(id);
  }
}
