import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { OrderModule } from "./order/order.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { WorkerModule } from "./worker/worker.module";
import { BusinessModule } from "./business/business.module";

@Module({
  imports: [
    OrderModule,
    WorkerModule,
    BusinessModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbUri = configService.get("DB_URI");

        return {
          uri: `${dbUri}${dbUri.endsWith("/") ? "" : "/"}BarApp`,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
