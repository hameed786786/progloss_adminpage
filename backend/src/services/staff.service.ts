import { Staff } from '../types';
import { StaffModel } from '../models/staff.model';
import mongoose from '../config/database';

export class StaffService {
  async list(): Promise<Staff[]> {
    if (mongoose.connection.readyState !== 1) return [];
    return (await StaffModel.find().lean()) as unknown as Staff[];
  }

  async get(id: string): Promise<Staff | undefined> {
    if (mongoose.connection.readyState !== 1) return undefined;
    return (await StaffModel.findOne({ id }).lean()) as unknown as Staff | undefined;
  }

  async create(payload: Record<string, unknown>) {
    return StaffModel.create(payload);
  }

  async update(id: string, payload: Record<string, unknown>) {
    return StaffModel.findOneAndUpdate({ id }, payload, { new: true }).lean();
  }

  async remove(id: string) {
    return StaffModel.deleteOne({ id });
  }
}

export const staffService = new StaffService();
