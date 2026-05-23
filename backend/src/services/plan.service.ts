import { Plan } from '../types';
import { PlanModel } from '../models/plan.model';
import mongoose from '../config/database';

export class PlanService {
  async list(): Promise<Plan[]> {
    if (mongoose.connection.readyState !== 1) return [];
    return (await PlanModel.find().lean()) as unknown as Plan[];
  }

  async get(id: string): Promise<Plan | undefined> {
    if (mongoose.connection.readyState !== 1) return undefined;
    return (await PlanModel.findOne({ id }).lean()) as unknown as Plan | undefined;
  }

  async create(payload: Record<string, unknown>) {
    return PlanModel.create(payload);
  }

  async update(id: string, payload: Record<string, unknown>) {
    return PlanModel.findOneAndUpdate({ id }, payload, { new: true }).lean();
  }

  async remove(id: string) {
    return PlanModel.deleteOne({ id });
  }
}

export const planService = new PlanService();
