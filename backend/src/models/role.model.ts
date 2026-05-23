import mongoose, { Schema } from 'mongoose';

const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  desc: { type: String },
  // permission matrix: { moduleName: [numbers...] }
  matrix: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() }
});

RoleSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const RoleModel = mongoose.models.Role || mongoose.model('Role', RoleSchema);
