import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { BusinessService } from "./business.service";
import { BusinessDTO } from "./types/dto/business.dto";

@Controller("/business")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get("/:id")
  async findOne(@Param("id") id: string) {
    return await this.businessService.findOne(id);
  }

  @Post("/create")
  async create(@Body() business: BusinessDTO) {
    return await this.businessService.create(business);
  }
}
