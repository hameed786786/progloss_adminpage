import mongoose, { Schema } from 'mongoose';

const StaffSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  role: { type: String },
  zone: { type: String },
  status: { type: String },
  building: { type: String },
  plate: { type: String },
  shift: { type: String },
  eta: { type: String }
});

export const StaffModel = mongoose.models.Staff || mongoose.model('Staff', StaffSchema);
