import { Module } from "@nestjs/common";
import { BusinessController } from "./business.controller";
import { BusinessService } from "./business.service";
import { BusinessRepository } from "./business.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { BusinessSchema } from "./business.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Business", schema: BusinessSchema }]),
  ],
  controllers: [BusinessController],
  providers: [BusinessService, BusinessRepository],
  exports: [BusinessRepository],
})
export class BusinessModule {}
