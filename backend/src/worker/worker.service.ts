import { Injectable } from "@nestjs/common";
import { WorkerRepository } from "./worker.repository";
import { WorkerReturn } from "./types/interfaces/return.interface";
import { CreateWorkerDto } from "./types/dto/create-worker.dto";
import { WorkerRole } from "./types/enums/role.enum";
import { Worker } from "./worker.schema";

@Injectable()
export class WorkerService {
  constructor(private readonly workerRepository: WorkerRepository) {}

  async index() {
    return await this.workerRepository.index();
  }

  async findOne(id: string) {
    const worker = this.workerRepository.findOne(id);

    if (!worker) {
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };
    }

    return worker;
  }

  async createWorker(worker: CreateWorkerDto) {
    const missingFields: string[] = [];

    const requiredFields = [
      "fullName",
      "displayName",
      "role",
      "email",
      "pin",
      "hireDate",
    ];

    for (const field of requiredFields) {
      if (!worker[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}.`,
      };
    }

    const workerCreation = {
      ...worker,
      pinHash: worker.pin,
    };

    if (
      worker.role !== WorkerRole.ADMIN &&
      worker.role !== WorkerRole.BARTENDER &&
      worker.role !== WorkerRole.CHEF &&
      worker.role !== WorkerRole.DELIVERY &&
      worker.role !== WorkerRole.MANAGER &&
      worker.role !== WorkerRole.WAITER
    ) {
      return {
        success: false,
        message: `Invalid role: ${worker.role}. Allowed roles: ADMIN, MANAGER, CHEF, BARTENDER, WAITER, DELIVERY`,
      };
    }

    const emailRegistered = !!(await this.workerRepository.findByEmail(
      worker.email,
    ));

    if (emailRegistered)
      return {
        success: false,
        message: `Email ${worker.email} is already registered.`,
      };

    return await this.workerRepository.createWorker(workerCreation);
  }

  async deleteWorker(id: string) {
    const deletedWorker = await this.workerRepository.deleteWorker(id);

    if (!deletedWorker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    return deletedWorker;
  }

  /// UPDATE

  async changeRole(id: string, role: string) {
    const worker = await this.workerRepository.findOne(id);

    if (!worker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    if (
      role !== WorkerRole.ADMIN &&
      role !== WorkerRole.BARTENDER &&
      role !== WorkerRole.CHEF &&
      role !== WorkerRole.DELIVERY &&
      role !== WorkerRole.MANAGER &&
      role !== WorkerRole.WAITER
    ) {
      return {
        success: false,
        message: `Invalid role: ${role}. Allowed roles: ADMIN, MANAGER, CHEF, BARTENDER, WAITER, DELIVERY`,
      };
    }

    return this.workerRepository.changeRole(id, role);
  }

  async changeEmail(id: string, email: string) {
    const worker = await this.workerRepository.findOne(id);

    if (!worker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    const emailRegistered = !!(await this.workerRepository.findByEmail(email));

    if (emailRegistered)
      return {
        success: false,
        message: `Email ${email} is already registered.`,
      };

    return this.workerRepository.changeEmail(id, email);
  }

  async deactivate(id: string) {
    const worker = await this.workerRepository.findOne(id);

    if (!worker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    if (!worker.isActive) return this.workerRepository.deactivate(id);
  }

  async activate(id: string) {
    const worker = await this.workerRepository.findOne(id);

    if (!worker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    return this.workerRepository.activate(id);
  }
}
