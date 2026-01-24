import mongoose, { Schema } from 'mongoose'

const RateLimitSchema = new Schema(
  {
    ip: { type: String, required: true, unique: true },
    count: { type: Number, default: 1 },
    lastRequest: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const RateLimit =
  mongoose.models.RateLimit ||
  mongoose.model('RateLimit', RateLimitSchema)
