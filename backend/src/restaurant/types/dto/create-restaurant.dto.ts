import {
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";
import type { Address } from "../interface/address.interface";
import { OpeningHours } from "../interface/opening-hours.interface";
import { MenuItem } from "../interface/menu-item.interface";

export class CreateRestaurantDTO {
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  description: string;

  @IsObject()
  address: Address;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  cuisines?: string[];

  @IsOptional()
  openingHours?: OpeningHours[];

  @IsNumber()
  @IsOptional()
  totalTables?: number;

  @IsOptional()
  menu?: MenuItem[];
}
