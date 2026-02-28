import mongoose, { Schema } from "mongoose";

const RateLimitSchema = new Schema(
  {
    email:
    {
      type: String,
      required: true,
      unique: true
    },
    count:
    {
      type: Number,
      default: 1
    },
  },
  {
    timestamps: true
  }
);

export const RateLimit =
  mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema)