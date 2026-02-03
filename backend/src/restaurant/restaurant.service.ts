import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { RestaurantRepository } from "./restaurant.repository";
import { CreateRestaurantDTO } from "./types/dto/create-restaurant.dto";
import { Restaurant } from "./restaurant.schema";
import { Address } from "./types/interface/address.interface";
import { OpeningHours } from "./types/interface/opening-hours.interface";
import { MenuItem } from "./types/interface/menu-item.interface";

@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async index(): Promise<Restaurant[]> {
    return await this.restaurantRepository.index();
  }

  async findOne(id: string): Promise<Restaurant | BadRequestException> {
    const restaurant = await this.restaurantRepository.findOne(id);

    if (!restaurant) throw new NotFoundException("Restaurant not found");

    return restaurant;
  }

  async create(
    restaurant: CreateRestaurantDTO,
  ): Promise<Restaurant | BadRequestException | ConflictException> {
    const isValidAddress = this.validateAddress(restaurant.address);

    if (!isValidAddress)
      throw new BadRequestException(
        "Invalid address. Address required fields: ",
        ["zip", "street", "number", "neighborhood", "city"].join(", "),
      );

    if (restaurant.openingHours) {
      const isValidOpeningHours = this.validateOpeningHours(
        restaurant.openingHours,
      );

      if (!isValidOpeningHours)
        throw new BadRequestException(
          "Invalid opening hours. Opening hours required fields: ",
          ["day", "open", "close"].join(", "),
        );
    }

    if (restaurant.menu) {
      const isValidMenu = this.validateMenu(restaurant.menu);

      if (!isValidMenu)
        throw new BadRequestException(
          "Invalid menu. Menu required fields: ",
          ["category", "name", "description", "price"].join(", "),
        );
    }

    if (restaurant.phone) {
      const phoneExists = await this.restaurantRepository.findByPhone(
        restaurant.phone,
      );

      if (phoneExists) {
        throw new ConflictException("Phone is already registered.");
      }
    }

    if (restaurant.email) {
      const emailExists = await this.restaurantRepository.findByEmail(
        restaurant.email,
      );

      if (emailExists) {
        throw new ConflictException("Email is already registered.");
      }
    }

    return await this.restaurantRepository.create(restaurant);
  }

  async update(
    id: string,
    restaurantUpdate: Partial<Restaurant>,
  ): Promise<Restaurant | BadRequestException> {
    const restaurant = await this.restaurantRepository.findOne(id);

    if (!restaurant) throw new NotFoundException("Restaurant not found");

    for (const key in restaurantUpdate) {
      if (!restaurantUpdate[key]) {
        restaurantUpdate[key] = restaurant[key];
      }
    }

    if (restaurantUpdate.address) {
      const isValidAddress = this.validateAddress(restaurantUpdate.address);

      if (!isValidAddress)
        throw new BadRequestException(
          "Invalid address. Address required fields: ",
          ["zip", "street", "number", "neighborhood", "city"].join(", "),
        );
    }

    if (restaurantUpdate.openingHours) {
      const isValidOpeningHours = this.validateOpeningHours(
        restaurantUpdate.openingHours,
      );

      if (!isValidOpeningHours)
        throw new BadRequestException(
          "Invalid opening hours. Opening hours required fields: ",
          ["day", "open", "close"].join(", "),
        );
    }

    if (restaurantUpdate.menu) {
      const isValidMenu = this.validateMenu(restaurantUpdate.menu);

      if (!isValidMenu)
        throw new BadRequestException(
          "Invalid menu. Menu required fields: ",
          ["category", "name", "description", "price"].join(", "),
        );
    }

    if (restaurantUpdate.phone) {
      const phoneExists = await this.restaurantRepository.findByPhone(
        restaurantUpdate.phone,
      );

      if (phoneExists && restaurantUpdate.phone !== phoneExists.phone) {
        throw new ConflictException("Phone is already registered.");
      }
    }

    if (restaurantUpdate.email) {
      const emailExists = await this.restaurantRepository.findByEmail(
        restaurantUpdate.email,
      );

      if (emailExists && restaurantUpdate.email !== emailExists.email) {
        throw new ConflictException("Email is already registered.");
      }
    }

    const updatedRestaurant = await this.restaurantRepository.update(
      id,
      restaurantUpdate,
    );

    if (!updatedRestaurant)
      throw new NotFoundException("Restaurant not found.");

    return updatedRestaurant;
  }

  async delete(id: string): Promise<Restaurant | NotFoundException> {
    const restaurant = await this.restaurantRepository.delete(id);

    if (!restaurant) throw new NotFoundException("Restaurant not found");

    return restaurant;
  }

  ///

  async findByPhone(phone: string): Promise<Restaurant | null> {
    const restaurant = await this.restaurantRepository.findByPhone(phone);

    if (!restaurant) return null;

    return restaurant;
  }

  async findByEmail(email: string): Promise<Restaurant | null> {
    const restaurant = await this.restaurantRepository.findByEmail(email);

    if (!restaurant) return null;

    return restaurant;
  }

  private validateAddress(address: Address): boolean {
    const addressFields = ["zip", "street", "number", "neighborhood", "city"];

    const addressErrors: string[] = [];

    addressFields.forEach((field) => {
      if (!address[field]) {
        addressErrors.push(field);
      }
    });

    if (addressErrors.length > 0) return false;

    return true;
  }

  private validateOpeningHours(openingHours: OpeningHours[]): boolean {
    const openingHoursFields = ["day", "open", "close"];

    const openingHoursErrors: string[] = [];

    openingHours.forEach((openingHour) => {
      openingHoursFields.map((field) => {
        if (!openingHour[field]) {
          openingHoursErrors.push(field);
        }
      });
    });

    if (openingHoursErrors.length > 0) return false;

    return true;
  }

  private validateMenu(menu: MenuItem[]): boolean {
    const menuFields = ["category", "name", "description", "price"];

    const menuErrors: string[] = [];
    menu.forEach((item) => {
      menuFields.map((field) => {
        if (!item[field]) {
          menuErrors.push(field);
        }
      });
    });

    if (menuErrors.length > 0) return false;

    return true;
  }
}
