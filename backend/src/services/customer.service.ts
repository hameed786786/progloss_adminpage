import { ApiError } from '../common/errors/api-error';
import { CustomerModel } from '../models/customer.model';
import mongoose from '../config/database';

export class CustomerService {
  list() {
    return CustomerModel.find().sort({ id: 1 }).lean();
  }

  async get(id: string) {
    if (mongoose.connection.readyState !== 1) return undefined;
    const customer = await CustomerModel.findOne({ id }).lean();
    if (!customer) throw new ApiError(404, 'Customer not found', 'CUSTOMER_NOT_FOUND');
    return customer;
  }

  create(payload: Record<string, unknown>) {
    return CustomerModel.create(payload);
  }

  async update(id: string, payload: Record<string, unknown>) {
    const updated = await CustomerModel.findOneAndUpdate({ id }, payload, { new: true }).lean();
    if (!updated) throw new ApiError(404, 'Customer not found', 'CUSTOMER_NOT_FOUND');
    return updated;
  }

  async remove(id: string) {
    const result = await CustomerModel.deleteOne({ id });
    if (result.deletedCount === 0) throw new ApiError(404, 'Customer not found', 'CUSTOMER_NOT_FOUND');
    return result;
  }
}

export const customerService = new CustomerService();
