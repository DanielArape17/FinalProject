import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

planSchema.plugin(mongoosePaginate);

/**
 * @description Plan Schema and Model (Subscriptions)
 * @summary Defines the different service levels available on the platform 
 * (Free, Plus, Premium, Pro, B2B). It stores commercial costs and, 
 * most importantly, the technical AI limits for each tier, allowing 
 * strict control over resource consumption per user.
 * Includes: Pricing management, benefit lists, and usage quotas (Rate Limiting).
 * Based on: Monetization standards and logical deletion.
 * @prop {string} name - Unique subscription tier name: 'free', 'plus', 'premium', 'pro', 'b2b'.
 * @prop {string} description - Detailed explanation of the plan.
 * @prop {Object} pricing - Monthly and annual costs in USD.
 * @prop {string[]} benefits - Array of features included to be displayed on the frontend.
 * @prop {Object} limits - Technical AI and usage quotas (max routes, cards, tokens, etc.).
 * @prop {boolean} isActive - Flag to enable or disable the plan globally.
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @prop {Date} deletedAt - Timestamp of logical deletion.
 * @prop {ObjectId} deletedBy - Reference to the user who performed the deletion.
 * @author Daniel Arapé
 */
const planSchema = new mongoose.Schema(
  {
    // --- Plan Identification ---
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      enum: ["free", "plus", "premium", "pro", "b2b"],
      description: "Unique name of the subscription tier",
    },
    description: {
      type: String,
      trim: true,
    },

    // --- Pricing Structure ---
    pricing: {
      monthlyUsd: { type: Number, default: 0, min: 0 },
      annualUsd: { type: Number, default: 0, min: 0 },
    },

    // --- Features and Marketing ---
    benefits: {
      type: [String],
      default: [],
      description:
        "List of features included to be displayed on the frontend",
    },

    // --- Technical and AI Limits ---
    limits: {
      maxActiveRoutes: { type: Number, default: 1 },
      freeCardsPerRoute: { type: Number, default: 2 },
      rewardedAdsPerDay: { type: Number, default: 3 },
      tokensPerDay: { type: Number, default: 1000 },
      concurrentGenerations: { type: Number, default: 1 },
      priorityAI: { type: Boolean, default: false },
    },

    isActive: { type: Boolean, default: true },

    // --- State and Audit ---
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;