import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Business } from "./business.schema";
import { BusinessDTO } from "./types/dto/business.dto";
import { WeekDay } from "./types/enums/week-day.enum";
import { PaymentMethod } from "src/order/types/enums/payment-method.enum";
import { Origin } from "src/order/types/enums/origin.enum";
import { DailySummary } from "./types/interfaces/daily-summary.interface";
import { AverageTicket } from "./types/interfaces/average-ticket.interface";
import { SalesByOrigin } from "./types/interfaces/sales-by-origin.interface";
import { TopItems } from "./types/interfaces/top-items.interface";

@Injectable()
export class BusinessRepository {
  constructor(
    @InjectModel("Business") private readonly businessModel: Model<Business>,
  ) {}

  async findOne(id: string): Promise<Business> {
    const business = await this.businessModel.findById(id);

    return business as Business;
  }

  async findByOrderId(id: string): Promise<Business> {
    const business = await this.businessModel.findOne({
      originalOrderId: id,
    });

    return business as Business;
  }

  async create(business: BusinessDTO): Promise<Business> {
    const createdBusiness = await this.businessModel.create(business);

    return createdBusiness as Business;
  }

  /// CONSULTAS DE AGREGAÇÃO

  async getDailySummary(
    startOfDay: Date,
    endOfDay: Date,
  ): Promise<DailySummary> {
    const dailySummary = await this.businessModel.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
          totalDiscount: { $sum: "$discount" },
          totalDeliveryFee: { $sum: "$deliveryFee" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1,
          totalDiscount: 1,
          totalDeliveryFee: 1,
          averageTicket: { $divide: ["$totalRevenue", "$totalOrders"] },
        },
      },
    ]);

    return dailySummary[0] as DailySummary;
  }

  async getAverageTicketByWaiter(): Promise<AverageTicket[]> {
    const result = await this.businessModel.aggregate([
      {
        $group: {
          _id: "$waiterId",
          waiterName: { $first: "$waiterName" },
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          waiterId: "$_id",
          waiterName: "$waiterName",
          totalRevenue: 1,
          totalOrders: 1,
          averageTicket: { $divide: ["$totalRevenue", "$totalOrders"] },
        },
      },
    ]);

    return result as AverageTicket[];
  }

  async getTotalSalesByOrigin(): Promise<SalesByOrigin[]> {
    const result = await this.businessModel.aggregate([
      {
        $group: {
          _id: "$origin",
          origin: { $first: "$origin" },
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          origin: 1,
          totalRevenue: 1,
          totalOrders: 1,
          averageTicket: { $divide: ["$totalRevenue", "$totalOrders"] },
        },
      },
    ]);

    return result as SalesByOrigin[];
  }

  async getTopSellingItems(limit: number): Promise<TopItems[]> {
    const result = await this.businessModel.aggregate([
      {
        $unwind: "$itemsDenormalized",
      },
      {
        $group: {
          _id: "$itemsDenormalized.itemId",
          itemName: { $first: "$itemsDenormalized.itemName" },
          category: { $first: "$itemsDenormalized.category" },
          totalUnitsSold: { $sum: "$itemsDenormalized.quantity" },
        },
      },
      {
        $sort: { totalUnitsSold: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          itemId: "$_id",
          itemName: 1,
          category: 1,
          totalUnitsSold: 1,
        },
      },
    ]);

    return result as TopItems[];
  }

  /// CONSULTAS GERAIS

  // DATA

  async findByDateRange(startDate: Date, endDate: Date): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      date: { $gte: startDate, $lte: endDate },
    });

    return businessList as Business[];
  }

  async findByWeekDay(weekDay: WeekDay): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      weekDay: weekDay,
    });

    return businessList as Business[];
  }

  async findByHourSlot(
    startHour: number,
    endHour: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      hourSlot: { $gte: startHour, $lte: endHour },
    });

    return businessList as Business[];
  }

  // FINANCEIRO

  async findByDiscount(
    startDiscount: number,
    endDiscount: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      discount: { $gte: startDiscount, $lte: endDiscount },
    });

    return businessList as Business[];
  }

  async findByDeliveryFee(
    startDeliveryFee: number,
    endDeliveryFee: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      deliveryFee: { $gte: startDeliveryFee, $lte: endDeliveryFee },
    });

    return businessList as Business[];
  }

  async findByCustomerCount(
    startCustomers: number,
    endCustomers: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      customerCount: { $gte: startCustomers, $lte: endCustomers },
    });

    return businessList as Business[];
  }

  async findByPaymentMethod(paymentMethod: PaymentMethod): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      paymentMethod,
    });

    return businessList as Business[];
  }

  async findByOrigin(origin: Origin): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      origin,
    });

    return businessList as Business[];
  }

  // ESTOQUE & PRODUTO

  async findByTotalItems(
    startTotalItems: number,
    endTotalItems: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      totalItemsCount: { $gte: startTotalItems, $lte: endTotalItems },
    });

    return businessList as Business[];
  }

  // DESEMPENHO DOS FUNCIONÁRIOS & LOGÍSTICA

  async findByTimeToStartPreparing(
    startValue: number,
    endValue: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      timeToStartPreparing: { $gte: startValue, $lte: endValue },
    });

    return businessList as Business[];
  }

  async findByTimePreparing(
    startTimePreparing: number,
    endTimePreparing: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      timePreparing: { $gte: startTimePreparing, $lte: endTimePreparing },
    });

    return businessList as Business[];
  }

  async findByTimeToDelivery(
    startTimeToDelivery: number,
    endTimeToDelivery: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      timeToDelivery: { $gte: startTimeToDelivery, $lte: endTimeToDelivery },
    });

    return businessList as Business[];
  }

  async findByWaiterId(waiterId: string): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      waiterId,
    });

    return businessList as Business[];
  }

  async findByWaiterName(waiterName: string): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      waiterName,
    });

    return businessList as Business[];
  }

  async findByTransactionHandlerId(
    transactionHandlerId: string,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      transactionHandlerId,
    });

    return businessList as Business[];
  }

  async findByTransactionHandlerName(
    transactionHandlerName: string,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      transactionHandlerName,
    });

    return businessList as Business[];
  }

  async findByDeliveryNeighborhood(
    deliveryNeighborhood: string,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      deliveryNeighborhood,
    });

    return businessList as Business[];
  }

  async findByCanceled(): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      isCanceled: true,
    });

    return businessList as Business[];
  }

  async findByCancelReason(reason: string): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      cancellationReason: reason,
    });

    return businessList as Business[];
  }
}
