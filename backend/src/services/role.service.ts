import { RoleModel } from '../models/role.model';

export class RoleService {
  async create(payload: any): Promise<any> {
    const doc = new RoleModel(payload);
    await doc.save();
    return doc.toObject();
  }

  async findByName(name: string): Promise<any | null> {
    return RoleModel.findOne({ name }).lean<any>().exec();
  }

  async list(): Promise<any[]> {
    return RoleModel.find().lean<any>().exec();
  }

  async updateMatrix(name: string, matrix: Record<string, number[]>): Promise<any | null> {
    return RoleModel.findOneAndUpdate({ name }, { matrix, updatedAt: new Date() }, { upsert: true, new: true }).lean<any>().exec();
  }

  async deleteByName(name: string) {
    return RoleModel.deleteOne({ name });
  }
}

export const roleService = new RoleService();
