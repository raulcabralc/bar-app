import { Injectable } from "@nestjs/common";
import { BusinessRepository } from "./business.repository";
import { Business } from "./business.schema";
import { BusinessReturn } from "./types/interfaces/return.interface";
import { BusinessDTO } from "./types/dto/business.dto";
import { OrderType } from "src/order/types/enums/type.enum";
import { PaymentMethod } from "src/order/types/enums/payment-method.enum";
import { Origin } from "src/order/types/enums/origin.enum";
import { ItemCategory } from "src/order/types/enums/item-category.enum";
import { WeekDay } from "./types/enums/week-day.enum";

@Injectable()
export class BusinessService {
  constructor(private readonly businessRepository: BusinessRepository) {}

  async findOne(id: string): Promise<Business | BusinessReturn> {
    const business = await this.businessRepository.findOne(id);

    if (!business)
      return {
        success: false,
        message: `Relatory with id ${id} not found.`,
      };

    return business as Business;
  }

  async findByOrderId(id: string): Promise<Business | BusinessReturn> {
    const business = await this.businessRepository.findByOrderId(id);

    if (!business)
      return {
        success: false,
        message: `Relatory for order with id ${id} not found.`,
      };

    return business as Business;
  }

  async create(business: BusinessDTO): Promise<Business | BusinessReturn> {
    const missingFields: string[] = [];

    const businessFields = [
      "originalOrderId",
      "date",
      "weekDay",
      "hourSlot",
      "subtotal",
      "discount",
      "total",
      "paymentMethod",
      "origin",
      "itemsDenormalized",
      "totalItemsCount",
      "timeToStartPreparing",
      "timePreparing",
      "orderType",
      "waiterId",
      "waiterName",
      "isCanceled",
    ];

    const itemsFields = [
      "itemId",
      "itemName",
      "category",
      "quantity",
      "unitPrice",
      "totalPrice",
    ];

    for (const field of businessFields) {
      if (!(field in business)) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    const missingItemsFields: string[] = [];

    for (const field of itemsFields) {
      for (const item of business.itemsDenormalized) {
        if (!item[field]) {
          missingItemsFields.push(`itemsDenormalized.${field}`);
        }
      }
    }

    if (missingItemsFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields in itemsDenormalized: ${missingItemsFields.join(", ")}`,
      };
    }

    if (!Object.values(WeekDay).includes(business.weekDay)) {
      return {
        success: false,
        message: `Invalid weekDay value. Valid week days: ${Object.values(WeekDay).join(", ")}`,
      };
    }

    if (!Object.values(PaymentMethod).includes(business.paymentMethod)) {
      return {
        success: false,
        message: `Invalid paymentMethod value. Valid payment methods: ${Object.values(PaymentMethod).join(", ")}`,
      };
    }

    if (!Object.values(Origin).includes(business.origin)) {
      return {
        success: false,
        message: `Invalid origin value. Valid origins: ${Object.values(Origin).join(", ")}`,
      };
    }

    for (const item of business.itemsDenormalized) {
      if (!Object.values(ItemCategory).includes(item.category)) {
        return {
          success: false,
          message: `Invalid category value: ${item.category}. Valid categories: ${Object.values(ItemCategory).join(", ")}`,
        };
      }
    }

    if (!Object.values(OrderType).includes(business.orderType)) {
      return {
        success: false,
        message: `Invalid orderType value. Valid order types: ${Object.values(OrderType).join(", ")}`,
      };
    }

    if (business.orderType === OrderType.DELIVERY) {
      const missingDeliveryFields: string[] = [];

      const deliveryFields = [
        "deliveryFee",
        "timeToDelivery",
        "deliveryNeighborhood",
      ];

      for (const field of deliveryFields) {
        if (!(field in deliveryFields)) {
          missingDeliveryFields.push(field);
        }
      }

      if (missingDeliveryFields.length > 1) {
        return {
          success: false,
          message: `Missing required fields for delivery orders: ${missingDeliveryFields.join(", ")}`,
        };
      }
    }

    const businessCreation = { ...business };

    return (await this.businessRepository.create(businessCreation)) as Business;
  }
}
