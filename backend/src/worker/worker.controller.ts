import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { WorkerService } from "./worker.service";
import { CreateWorkerDto } from "./types/dto/create-worker.dto";

@Controller("/worker")
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Get("/")
  async index() {
    return await this.workerService.index();
  }

  @Get("/:id")
  async findOne(@Param("id") id: string) {
    return await this.workerService.findOne(id);
  }

  @Post("/create")
  async createWorker(@Body() worker: CreateWorkerDto) {
    return await this.workerService.createWorker(worker);
  }

  @Delete("/delete/:id")
  async deleteWorker(@Param("id") id: string) {
    return await this.workerService.deleteWorker(id);
  }
}
