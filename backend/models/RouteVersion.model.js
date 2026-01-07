import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * @description Route Version Schema and Model (RouteVersion)
 * @summary Stores complete snapshots of a route at a given point in time. 
 * It enables change history maintenance, facilitates data recovery (rollback), 
 * and allows auditing of AI-generated content evolution.
 * Includes: Content snapshots, version traceability, and AI usage metrics.
 * @prop {ObjectId} routeId - Reference to the parent route this version belongs to.
 * @prop {number} version - Sequential version number (e.g., 1, 2, 3...).
 * @prop {ObjectId} createdBy - User who requested the new version (null if automated).
 * @prop {Object} contentSnapshot - Deep copy of the route title, summary, and associated cards.
 * @prop {Object} tokenUsage - AI resource consumption (input and output tokens).
 * @prop {string} cacheKey - Hash or key used to prevent redundant AI generations.
 * @prop {string} note - Internal annotation regarding the reason for the update.
 * @author Daniel Arapé
 */
const routeVersionSchema = new mongoose.Schema(
  {
    // --- Link to Primary Route ---
    routeId: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      required: true,
      index: true,
      description: "ID of the route that this version belongs to",
    },
    version: {
      type: Number,
      required: true,
      description: "Sequential version number (e.g. 1, 2, 3...)",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      description:
        "User who requested the new version (null if automatic)",
    },

    // --- Content Snapshot ---
    contentSnapshot: {
      title: { type: String, trim: true },
      summary: { type: String, trim: true },
      cards: [
        {
          cardId: { type: Schema.Types.ObjectId, ref: "Card" },
          title: { type: String, trim: true },
          summary: { type: String, trim: true },
          order: { type: Number },
        },
      ],
    },

    // --- AI Metrics and Auditing ---
    tokenUsage: {
      inputTokens: { type: Number, default: 0 },
      outputTokens: { type: Number, default: 0 },
    },
    cacheKey: {
      type: String,
      trim: true,
      description:
        "Cache key used to prevent duplicate generations",
    },
    note: {
      type: String,
      trim: true,
      description:
        "Internal comment (e.g. 'Regeneration due to prompt update')",
    },
  },
  {
    timestamps: true,
  }
);

const RouteVersion = mongoose.model("RouteVersion", routeVersionSchema);

export default RouteVersion;