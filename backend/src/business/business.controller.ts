import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { BusinessService } from "./business.service";
import { BusinessDTO } from "./types/dto/business.dto";
import { WeekDay } from "./types/enums/week-day.enum";
import { PaymentMethod } from "src/order/types/enums/payment-method.enum";
import { Origin } from "src/order/types/enums/origin.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import type { Request } from "express";
import { WorkerRole } from "src/worker/types/enums/role.enum";

@Controller("/business")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  async findOne(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    return await this.businessService.findOne(restaurantId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/order/:id")
  async findByOrderId(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    return await this.businessService.findByOrderId(restaurantId, id);
  }

  /// CONSULTAS AGREGADAS

  @UseGuards(JwtAuthGuard)
  @Get("/daily-summary")
  async getDailySummary(@Req() req: Request, @Query("date") date?: string) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.getDailySummary(restaurantId, date);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/average-ticket-by-waiter")
  async getAverageTicketByWaiter(@Req() req: Request) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.getAverageTicketByWaiter(restaurantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/total-sales-by-origin")
  async getTotalSalesByOrigin(@Req() req: Request) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.getTotalSalesByOrigin(restaurantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/top-selling-items")
  async getTopSellingItems(
    @Req() req: Request,
    @Query("limit") limit?: number,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.getTopSellingItems(restaurantId, limit);
  }

  /// CONSULTAS GERAIS

  // DATA

  @UseGuards(JwtAuthGuard)
  @Get("/date-range")
  async findByDateRange(
    @Req() req: Request,
    @Query("startValue") startValue: Date,
    @Query("endValue") endValue?: Date,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByDateRange(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("/week-day")
  async findByWeekDay(@Req() req: Request, @Query("weekDay") weekDay: WeekDay) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByWeekDay(restaurantId, weekDay);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/hour-slot")
  async findByHourSlot(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByHourSlot(
      restaurantId,
      startValue,
      endValue,
    );
  }

  // FINANCEIRO

  @UseGuards(JwtAuthGuard)
  @Get("/discount")
  async findByDiscount(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByDiscount(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("/delivery-fee")
  async findByDeliveryFee(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByDeliveryFee(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("/customer-count")
  async findByCustomerCount(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByCustomerCount(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("/payment-method")
  async findByPaymentMethod(
    @Req() req: Request,
    @Query("paymentMethod") paymentMethod: PaymentMethod,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByPaymentMethod(
      restaurantId,
      paymentMethod,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("/origin")
  async findByOrigin(@Req() req: Request, @Query("origin") origin: Origin) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByOrigin(restaurantId, origin);
  }

  // ESTOQUE & PRODUTO

  @UseGuards(JwtAuthGuard)
  @Get("/total-items")
  async findByTotalItems(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByTotalItems(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("time-to-start")
  async findByTimeToStartValue(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByTimeToStartPreparing(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("time-preparing")
  async findByTimePreparing(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByTimePreparing(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("time-to-delivery")
  async findByTimeToDelivery(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByTimeToDelivery(
      restaurantId,
      startValue,
      endValue,
    );
  }

  // FUNCIONÁRIOS & DESEMPENHO

  @UseGuards(JwtAuthGuard)
  @Get("waiter-id")
  async findByWaiterId(
    @Req() req: Request,
    @Query("waiterId") waiterId: string,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByWaiterId(restaurantId, waiterId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("waiter-name")
  async findByWaiterName(
    @Req() req: Request,
    @Query("waiterName") waiterName: string,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByWaiterName(
      restaurantId,
      waiterName,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("transaction-handler-id")
  async findByTransactionHandlerId(
    @Req() req: Request,
    @Query("transactionHandlerId") transactionHandlerId: string,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByTransactionHandlerId(
      restaurantId,
      transactionHandlerId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("transaction-handler-name")
  async findByTransactionHandlerName(
    @Req() req: Request,
    @Query("transactionHandlerName") transactionHandlerName: string,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByTransactionHandlerName(
      restaurantId,
      transactionHandlerName,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("delivery-neighborhood")
  async findByDeliveryNeighborhood(
    @Req() req: Request,
    @Query("neighborhood") neighborhood: string,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByDeliveryNeighborhood(
      restaurantId,
      neighborhood,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("canceled")
  async findByCanceled(@Req() req: Request) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByCanceled(restaurantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("cancel-reason")
  async findByCancelReason(
    @Req() req: Request,
    @Query("reason") reason: string,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    const role = req.user?.role as string;

    if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role as WorkerRole)) {
      throw new UnauthorizedException(
        "Route restricted only to ADMIN or MANAGER",
      );
    }

    return await this.businessService.findByCancelReason(restaurantId, reason);
  }
}
