import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { BusinessService } from "./business.service";
import { BusinessDTO } from "./types/dto/business.dto";
import { WeekDay } from "./types/enums/week-day.enum";
import { PaymentMethod } from "src/order/types/enums/payment-method.enum";
import { Origin } from "src/order/types/enums/origin.enum";

@Controller("/business")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get("/order/:id")
  async findByOrderId(@Param("id") id: string) {
    return await this.businessService.findByOrderId(id);
  }

  @Post("/create")
  async create(@Body() business: BusinessDTO) {
    return await this.businessService.create(business);
  }

  /// CONSULTAS AGREGADAS

  @Get("/daily-summary")
  async getDailySummary(@Query("date") date?: string) {
    return await this.businessService.getDailySummary(date);
  }

  @Get("/average-ticket-by-waiter")
  async getAverageTicketByWaiter() {
    return await this.businessService.getAverageTicketByWaiter();
  }

  @Get("/total-sales-by-origin")
  async getTotalSalesByOrigin() {
    return await this.businessService.getTotalSalesByOrigin();
  }

  @Get("/top-selling-items")
  async getTopSellingItems(@Query("limit") limit?: number) {
    return await this.businessService.getTopSellingItems(limit);
  }

  /// CONSULTAS GERAIS

  // DATA

  @Get("/date-range")
  async findByDateRange(
    @Query("startValue") startValue: Date,
    @Query("endValue") endValue?: Date,
  ) {
    return await this.businessService.findByDateRange(startValue, endValue);
  }

  @Get("/week-day")
  async findByWeekDay(@Query("weekDay") weekDay: WeekDay) {
    return await this.businessService.findByWeekDay(weekDay);
  }

  @Get("/hour-slot")
  async findByHourSlot(
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    return await this.businessService.findByHourSlot(startValue, endValue);
  }

  // FINANCEIRO

  @Get("/discount")
  async findByDiscount(
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    return await this.businessService.findByDiscount(startValue, endValue);
  }

  @Get("/delivery-fee")
  async findByDeliveryFee(
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    return await this.businessService.findByDeliveryFee(startValue, endValue);
  }

  @Get("/customer-count")
  async findByCustomerCount(
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    return await this.businessService.findByCustomerCount(startValue, endValue);
  }

  @Get("/payment-method")
  async findByPaymentMethod(
    @Query("paymentMethod") paymentMethod: PaymentMethod,
  ) {
    return await this.businessService.findByPaymentMethod(paymentMethod);
  }

  @Get("/origin")
  async findByOrigin(@Query("origin") origin: Origin) {
    return await this.businessService.findByOrigin(origin);
  }

  @Get("/total-items")
  async findByTotalItems(
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    return await this.businessService.findByTotalItems(startValue, endValue);
  }

  @Get("time-to-start")
  async findByTimeToStartValue(
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    return await this.businessService.findByTimeToStartPreparing(
      startValue,
      endValue,
    );
  }

  @Get("time-preparing")
  async findByTimePreparing(
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    return await this.businessService.findByTimePreparing(startValue, endValue);
  }

  @Get("time-to-delivery")
  async findByTimeToDelivery(
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    return await this.businessService.findByTimeToDelivery(
      startValue,
      endValue,
    );
  }

  @Get("waiter-id")
  async findByWaiterId(@Query("waiterId") waiterId: string) {
    return await this.businessService.findByWaiterId(waiterId);
  }

  @Get("waiter-name")
  async findByWaiterName(@Query("waiterName") waiterName: string) {
    return await this.businessService.findByWaiterName(waiterName);
  }

  @Get("transaction-handler-id")
  async findByTransactionHandlerId(
    @Query("transactionHandlerId") transactionHandlerId: string,
  ) {
    return await this.businessService.findByTransactionHandlerId(
      transactionHandlerId,
    );
  }

  @Get("transaction-handler-name")
  async findByTransactionHandlerName(
    @Query("transactionHandlerName") transactionHandlerName: string,
  ) {
    return await this.businessService.findByTransactionHandlerName(
      transactionHandlerName,
    );
  }

  @Get("delivery-neighborhood")
  async findByDeliveryNeighborhood(
    @Query("neighborhood") neighborhood: string,
  ) {
    return await this.businessService.findByDeliveryNeighborhood(neighborhood);
  }

  @Get("canceled")
  async findByCanceled() {
    return await this.businessService.findByCanceled();
  }

  @Get("cancel-reason")
  async findByCancelReason(@Query("reason") reason: string) {
    return await this.businessService.findByCancelReason(reason);
  }

  // findOne

  @Get("/:id")
  async findOne(@Param("id") id: string) {
    return await this.businessService.findOne(id);
  }
}
