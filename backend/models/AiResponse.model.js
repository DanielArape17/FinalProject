import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * @description AI Response Schema and Model (AiResponse)
 * @summary Stores the final output delivered by the AI model. It contains both 
 * raw plain text and the parsed JSON structure required to build routes and cards. 
 * Additionally, it records consumption metrics (tokens) and financial costs 
 * for administrative and analytical control.
 * Includes: Structured storage, token usage metrics, and cost tracking.
 * @prop {ObjectId} aiRequestId - Reference to the original request that generated this response.
 * @prop {string} responseText - Raw response in plain text format.
 * @prop {Mixed} structured - Parsed JSON object (e.g., card titles, lessons, or custom objects).
 * @prop {number} tokensIn - Input tokens count (prompt size).
 * @prop {number} tokensOut - Output tokens count (completion size).
 * @prop {number} costUsd - Calculated cost in USD based on the provider's billing rates.
 * @prop {Mixed} providerMeta - Complete raw response from the provider for technical auditing.
 * @prop {boolean} cached - Indicates if this result was served from cache.
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @prop {Date} deletedAt - Timestamp of logical deletion.
 * @prop {ObjectId} deletedBy - Reference to the user who performed the deletion.
 * @author Daniel Arapé
 */
const aiResponseSchema = new mongoose.Schema(
  {
    // --- Request Linkage ---
    aiRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AiRequest",
      required: true,
      unique: true,
      index: true,
      description: "Link to the original prompt that triggered this response",
    },

    // --- Generated Content ---
    responseText: {
      type: String,
      description: "Raw completion text from the LLM",
    },
    structured: {
      type: mongoose.Schema.Types.Mixed,
      description: "Parsed JSON data for frontend or logic consumption",
    },

    // --- Consumption and Cost Metrics ---
    tokensIn: {
      type: Number,
      default: 0,
      description: "Input tokens (prompt volume)",
    },
    tokensOut: {
      type: Number,
      default: 0,
      description: "Output tokens (response volume)",
    },
    costUsd: {
      type: Number,
      default: 0,
      description: "Estimated cost in USD based on provider pricing",
    },

    // --- Technical Metadata ---
    providerMeta: {
      type: mongoose.Schema.Types.Mixed,
      description: "Full raw provider response for forensic or technical audit",
    },
    cached: {
      type: Boolean,
      default: false,
      description: "Flag indicating if the response was served from a cache layer",
    },

    // --- Logical Deletion Control ---
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
  }
);

const AiResponse = mongoose.model("AiResponse", aiResponseSchema);

export default AiResponse;