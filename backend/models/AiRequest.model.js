import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * @description AI Request Schema and Model (AiRequest)
 * @summary Records every request sent to Large Language Models (LLMs). 
 * Stores the prompt, model utilized, provider, and response status. 
 * Essential for cost monitoring, error debugging, and optimization via caching.
 * Includes: Prompt traceability, state management, and technical metadata.
 * @prop {ObjectId} userId - Reference to the user who triggered the request.
 * @prop {ObjectId} routeId - Reference to the associated Route context.
 * @prop {ObjectId} cardId - Reference to the associated Card context.
 * @prop {ObjectId} lessonId - Reference to the associated Lesson context.
 * @prop {string} prompt - The raw input text sent to the AI.
 * @prop {string} model - Specific model used (e.g., 'gpt-4o', 'gemini-1.5-pro').
 * @prop {string} provider - AI Service provider (e.g., 'openai', 'google').
 * @prop {string} status - Current state: 'pending', 'done', 'failed', or 'cached'.
 * @prop {boolean} cacheHit - True if the response was retrieved from DB instead of the API.
 * @prop {Mixed} extra - Additional metadata: token usage, latency, or API errors.
 * @prop {boolean} deleted - Logical deletion indicator (Soft Delete).
 * @prop {Date} deletedAt - Timestamp of logical deletion.
 * @prop {ObjectId} deletedBy - Reference to the user who performed the deletion.
 * @author Daniel Arapé
 */
const aiRequestSchema = new mongoose.Schema(
  {
    // --- Contextual References ---
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: "Route", default: null },
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: "Card", default: null },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", default: null },

    // --- Request Details ---
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      description: "Example: 'gpt-4o', 'gemini-1.5-pro', 'deepseek-v3'",
    },
    provider: {
      type: String,
      trim: true,
      description: "Example: 'openai', 'google', 'anthropic'",
    },

    // --- Status and Performance ---
    status: {
      type: String,
      enum: ["pending", "done", "failed", "cached"],
      default: "pending",
    },
    cacheHit: {
      type: Boolean,
      default: false,
      description: "Indicates if the response was retrieved without a new API call",
    },
    extra: {
      type: mongoose.Schema.Types.Mixed,
      description: "Technical metadata: token count, response time, API errors",
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

const AiRequest = mongoose.model("AiRequest", aiRequestSchema);

export default AiRequest;