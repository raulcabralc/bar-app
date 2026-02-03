import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Restaurant } from "./restaurant.schema";
import { CreateRestaurantDTO } from "./types/dto/create-restaurant.dto";

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectModel("Restaurant")
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async index(): Promise<Restaurant[]> {
    return await this.restaurantModel.find();
  }

  async findOne(id: string): Promise<Restaurant | null> {
    return await this.restaurantModel.findById(id);
  }

  async create(restaurant: CreateRestaurantDTO): Promise<Restaurant> {
    return await this.restaurantModel.create(restaurant);
  }

  async update(
    id: string,
    restaurant: Partial<Restaurant>,
  ): Promise<Restaurant | null> {
    return await this.restaurantModel.findByIdAndUpdate(id, restaurant, {
      new: true,
    });
  }

  async delete(id: string): Promise<Restaurant | null> {
    return await this.restaurantModel.findByIdAndDelete(id);
  }

  async findByPhone(phone: string): Promise<Restaurant | null> {
    return await this.restaurantModel.findOne({ phone });
  }

  async findByEmail(email: string): Promise<Restaurant | null> {
    return await this.restaurantModel.findOne({ email });
  }
}
