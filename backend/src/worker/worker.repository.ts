import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateWorkerDto } from "./types/dto/create-worker.dto";

@Injectable()
export class WorkerRepository {
  constructor(
    @InjectModel("Worker") private readonly workerModel: Model<Worker>,
  ) {}

  async index(): Promise<Worker[]> {
    const listedWorkers = await this.workerModel.find().sort({ name: 1 });

    return listedWorkers as Worker[];
  }

  async findOne(id: string): Promise<Worker> {
    const worker = await this.workerModel.findById(id);

    return worker as Worker;
  }

  async createWorker(worker: CreateWorkerDto): Promise<Worker> {
    const createdWorker = await this.workerModel.create(worker);

    return createdWorker as Worker;
  }

  async deleteWorker(id: string): Promise<Worker> {
    const deletedWorker = await this.workerModel.findByIdAndDelete(id);

    return deletedWorker as Worker;
  }

  /// UPDATE

  async changeRole(id: string, role: string): Promise<Worker> {
    const updatedWorker = await this.workerModel.findByIdAndUpdate(
      id,
      { role },
      { new: true },
    );

    return updatedWorker as Worker;
  }

  async changeEmail(id: string, email: string): Promise<Worker> {
    const updatedWorker = await this.workerModel.findByIdAndUpdate(
      id,
      { email },
      { new: true },
    );

    return updatedWorker as Worker;
  }

  async deactivate(id: string) {
    const updatedWorker = await this.workerModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    return updatedWorker as Worker;
  }

  async activate(id: string) {
    const updatedWorker = await this.workerModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true },
    );

    return updatedWorker as Worker;
  }

  /// UTILS

  async findByEmail(email: string): Promise<Worker> {
    const worker = await this.workerModel.findOne({ email });

    return worker as Worker;
  }
}
