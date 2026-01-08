import mongoose from "mongoose";

const coinSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  balance: {
    type: Number,
    default: 5, // First-time users get 5 coins
    min: 0,
  },
  lastResetDate: {
    type: Date,
    required: true,
    default: () => {
      // Set to start of current day (midnight)
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp on save
coinSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Coin = mongoose.models.Coin || mongoose.model("Coin", coinSchema);

export default Coin;
