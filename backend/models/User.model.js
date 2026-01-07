import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * @description User Schema and Model - Core Identity
 * @summary Represents the central entity of the system. Manages authentication, 
 * academic levels for AI personalization, token balances, and user preferences. 
 * Includes advanced security (MFA and account locking), route progress tracking, 
 * and soft delete support.
 * Includes: Security, Subscription Plans, AI Preferences, and Progress Tracking.
 * @prop {string} email - Unique primary identifier. Validated for standard email format.
 * @prop {string} authProvider - Identity provider: 'local', 'google', 'facebook', or 'apple'.
 * @prop {string} passwordHash - Encrypted password (excluded from default queries).
 * @prop {string} academicLevel - Education tier for AI context: 'primary', 'secondary', etc.
 * @prop {string} role - Access level: 'user', 'moderator', 'revisor', 'admin', 'superadmin'.
 * @prop {Object} plan - Subscription tier details and expiration.
 * @prop {number} tokensBalance - Current virtual currency balance.
 * @prop {Object} preferences - Notification, UI, and AI personalization settings.
 * @prop {Object} progress - Tracks completion percentage of educational routes.
 * @prop {Object} security - Metadata for MFA, failed logins, and account locking.
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @author Daniel Arapé
 */
const userSchema = new mongoose.Schema(
  {
    // --- Identity Data ---
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email format.",
      },
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook", "apple"],
      default: "local",
    },
    // -- Security --
    passwordHash: { type: String, select: false },
    passwordHistory: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 3,
        message: "You cannot reuse the last 3 passwords.",
      },
    },

    // -- Profile --
    name: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => /^[A-Za-záéíóúÁÉÍÓÚñÑ' ]+$/.test(v),
        message: "Name can only contain letters.",
      },
    },
    country: { type: String },
    language: { type: String, default: "en" },
    academicLevel: {
      type: String,
      enum: [
        "primary",
        "secondary",
        "high_school",
        "undergraduate",
        "postgraduate",
        "others",
      ],
      default: "others",
    },
    role: {
      type: String,
      enum: ["user", "moderator", "revisor", "admin", "superadmin"],
      default: "user",
    },

    // --- Monetization and Tokens ---
    plan: {
      tier: {
        type: String,
        enum: ["free", "plus", "premium", "pro", "b2b"],
        default: "free",
      },
      since: { type: Date },
      expiresAt: { type: Date },
    },
    tokensBalance: { type: Number, default: 0, min: 0 },

    // --- Personalization and Preferences ---
    preferences: {
      notifications: {
        progress: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false },
        security: { type: Boolean, default: true },
      },
      ui: {
        theme: {
          type: String,
          enum: ["light", "dark", "auto"],
          default: "auto",
        },
        fontSize: { type: String, enum: ["sm", "md", "lg"], default: "md" },
      },
      aiPersonalization: {
        consent: { type: Boolean, default: true },
        allowedCulturalExamples: { type: Boolean, default: true },
        keywords: { type: [String], default: [] },
      },
    },

    // --- Progress Tracking ---
    progress: {
      routes: [
        {
          routeId: { type: Schema.Types.ObjectId, ref: "Route" },
          percent: { type: Number, default: 0, min: 0, max: 100 },
          lastVisitedAt: { type: Date },
        },
      ],
    },

    // --- Security and Audit ---
    security: {
      mfaEnabled: { type: Boolean, default: false },
      lastLoginAt: { type: Date },
      failedLogins: { type: Number, default: 0 },
      lockedUntil: { type: Date },
    },

    // --- Administrative Control and Soft Delete ---
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;