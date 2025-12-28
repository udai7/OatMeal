import mongoose from "mongoose";

const rateLimitSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  feature: {
    type: String,
    required: true,
    enum: ["resume_ai", "cover_letter", "ats_check"],
  },
  count: {
    type: Number,
    default: 0,
  },
  resetAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient lookups
rateLimitSchema.index({ userId: 1, feature: 1 }, { unique: true });

const RateLimit =
  mongoose.models.RateLimit || mongoose.model("RateLimit", rateLimitSchema);

export default RateLimit;
