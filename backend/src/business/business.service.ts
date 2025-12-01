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
      "timeToStartValue",
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

  /// CONSULTAS AGREGADAS

  async getDailySummary(date?: string) {
    if (!date) {
      date = new Date().toISOString().split("T")[0].slice(0, 10);
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await this.businessRepository.getDailySummary(
      startOfDay,
      endOfDay,
    );

    if (!result) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalDiscount: 0,
        totalDeliveryFee: 0,
        averageTicket: 0,
      };
    }

    return result;
  }

  async getAverageTicketByWaiter() {
    return await this.businessRepository.getAverageTicketByWaiter();
  }

  async getTotalSalesByOrigin() {
    return await this.businessRepository.getTotalSalesByOrigin();
  }

  async getTopSellingItems(limit?: number) {
    if (!limit) {
      limit = 10;
    }

    return await this.businessRepository.getTopSellingItems(limit);
  }

  /// CONSULTAS GERAIS

  // DATA

  async findByDateRange(
    startValue: Date,
    endValue?: Date,
  ): Promise<Business[] | BusinessReturn> {
    if (!startValue) {
      return {
        success: false,
        message: "startValue is required.",
      };
    }

    if (!endValue) {
      endValue = startValue;
    }

    return await this.businessRepository.findByDateRange(startValue, endValue);
  }

  async findByWeekDay(weekDay: WeekDay): Promise<Business[] | BusinessReturn> {
    if (!weekDay || !Object.values(WeekDay).includes(weekDay)) {
      return {
        success: false,
        message: `Invalid weekDay value. Valid week days: ${Object.values(WeekDay).join(", ")}`,
      };
    }

    return await this.businessRepository.findByWeekDay(weekDay);
  }

  async findByHourSlot(
    startValue: number,
    endValue?: number,
  ): Promise<Business[] | BusinessReturn> {
    if (!startValue) {
      return {
        success: false,
        message: "startValue is required.",
      };
    }

    if (!endValue) {
      endValue = startValue;
    }

    return await this.businessRepository.findByHourSlot(startValue, endValue);
  }

  // FINANCEIRO

  async findByDiscount(
    startValue: number,
    endValue?: number,
  ): Promise<Business[] | BusinessReturn> {
    if (!startValue) {
      return {
        success: false,
        message: "startValue is required.",
      };
    }

    if (!endValue) {
      endValue = startValue;
    }

    return await this.businessRepository.findByDiscount(startValue, endValue);
  }

  async findByDeliveryFee(
    startValue: number,
    endValue?: number,
  ): Promise<Business[] | BusinessReturn> {
    if (!startValue) {
      return {
        success: false,
        message: "startValue is required.",
      };
    }

    if (!endValue) {
      endValue = startValue;
    }

    return await this.businessRepository.findByDeliveryFee(
      startValue,
      endValue,
    );
  }

  async findByCustomerCount(
    startValue: number,
    endValue?: number,
  ): Promise<Business[] | BusinessReturn> {
    if (!startValue) {
      return {
        success: false,
        message: "startValue is required.",
      };
    }

    if (!endValue) {
      endValue = startValue;
    }

    return await this.businessRepository.findByCustomerCount(
      startValue,
      endValue,
    );
  }

  async findByPaymentMethod(
    paymentMethod: PaymentMethod,
  ): Promise<Business[] | BusinessReturn> {
    if (
      !paymentMethod ||
      !Object.values(PaymentMethod).includes(paymentMethod)
    ) {
      return {
        success: false,
        message: `Invalid payment method: ${paymentMethod}. Valid payment methods: ${Object.values(PaymentMethod).join(", ")}}`,
      };
    }

    return await this.businessRepository.findByPaymentMethod(paymentMethod);
  }

  async findByOrigin(origin: Origin): Promise<Business[] | BusinessReturn> {
    if (!origin || !Object.values(Origin).includes(origin)) {
      return {
        success: false,
        message: `Invalid payment method: ${origin}. Valid payment methods: ${Object.values(PaymentMethod).join(", ")}}`,
      };
    }

    return await this.businessRepository.findByOrigin(origin);
  }

  // ESTOQUE & PRODUTO

  async findByTotalItems(
    startValue: number,
    endValue?: number,
  ): Promise<Business[] | BusinessReturn> {
    if (!startValue) {
      return {
        success: false,
        message: "startValue is required.",
      };
    }

    if (!endValue) {
      endValue = startValue;
    }

    return await this.businessRepository.findByTotalItems(startValue, endValue);
  }

  async findByTimeToStartPreparing(
    startValue: number,
    endValue?: number,
  ): Promise<Business[] | BusinessReturn> {
    if (!startValue) {
      return {
        success: false,
        message: "startValue is required.",
      };
    }

    if (!endValue) {
      endValue = startValue;
    }

    return await this.businessRepository.findByTimeToStartPreparing(
      startValue,
      endValue,
    );
  }

  async findByTimePreparing(
    startValue: number,
    endValue?: number,
  ): Promise<Business[] | BusinessReturn> {
    if (!startValue) {
      return {
        success: false,
        message: "startValue is required.",
      };
    }

    if (!endValue) {
      endValue = startValue;
    }

    return await this.businessRepository.findByTimePreparing(
      startValue,
      endValue,
    );
  }

  async findByTimeToDelivery(
    startValue: number,
    endValue?: number,
  ): Promise<Business[] | BusinessReturn> {
    if (!startValue) {
      return {
        success: false,
        message: "startValue is required.",
      };
    }

    if (!endValue) {
      endValue = startValue;
    }

    return await this.businessRepository.findByTimeToDelivery(
      startValue,
      endValue,
    );
  }

  async findByWaiterId(waiterId: string): Promise<Business[] | BusinessReturn> {
    if (!waiterId) {
      return {
        success: false,
        message: "waiterId is required.",
      };
    }

    return await this.businessRepository.findByWaiterId(waiterId);
  }

  async findByWaiterName(
    waiterName: string,
  ): Promise<Business[] | BusinessReturn> {
    if (!waiterName) {
      return {
        success: false,
        message: "waiterName is required.",
      };
    }

    return await this.businessRepository.findByWaiterName(waiterName);
  }

  async findByTransactionHandlerId(
    transactionHandlerId: string,
  ): Promise<Business[] | BusinessReturn> {
    if (!transactionHandlerId) {
      return {
        success: false,
        message: "transactionHandlerId is required.",
      };
    }

    return await this.businessRepository.findByTransactionHandlerId(
      transactionHandlerId,
    );
  }

  async findByTransactionHandlerName(
    transactionHandlerName: string,
  ): Promise<Business[] | BusinessReturn> {
    if (!transactionHandlerName) {
      return {
        success: false,
        message: "transactionHandlerName is required.",
      };
    }

    return await this.businessRepository.findByTransactionHandlerName(
      transactionHandlerName,
    );
  }

  async findByDeliveryNeighborhood(
    deliveryNeighborhood: string,
  ): Promise<Business[] | BusinessReturn> {
    if (!deliveryNeighborhood) {
      return {
        success: false,
        message: "deliveryNeighborhood is required.",
      };
    }

    return await this.businessRepository.findByDeliveryNeighborhood(
      deliveryNeighborhood,
    );
  }

  async findByCanceled(): Promise<Business[]> {
    return await this.businessRepository.findByCanceled();
  }

  async findByCancelReason(
    reason: string,
  ): Promise<Business[] | BusinessReturn> {
    if (!reason) {
      return {
        success: false,
        message: "reason is required.",
      };
    }

    return await this.businessRepository.findByCancelReason(reason);
  }
}
