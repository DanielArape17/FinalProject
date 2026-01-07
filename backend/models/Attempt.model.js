import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * @description User Attempt Schema and Model (Attempt)
 * @summary Records every execution of an exercise by a user.
 * Stores the submitted response, the grade obtained, and the time elapsed. 
 * Includes a snapshot of the user's subscription plan and evaluation costs 
 * if processed by AI.
 * Includes: Response traceability, performance metrics, and audit logs.
 * * @prop {ObjectId} userId - Reference to the user performing the attempt.
 * @prop {ObjectId} exerciseId - Reference to the specific exercise being solved.
 * @prop {ObjectId} lessonId - Optional reference to the associated lesson.
 * @prop {ObjectId} cardId - Optional reference to the associated card.
 * @prop {Mixed} response - User-submitted data (text, selected option, etc.).
 * @prop {boolean} isCorrect - Validation flag indicating if the answer was correct.
 * @prop {number} score - Achieved score on a scale from 0.0 to 1.0.
 * @prop {number} timeTakenSec - Duration in seconds spent on the attempt.
 * @prop {Object} planSnapshot - State of the user's plan (tier) at the moment of the attempt.
 * @prop {Object} aiEvaluation - Metrics related to AI-driven grading (request ID, tokens, cost).
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @prop {Date} deletedAt - Timestamp of logical deletion.
 * @prop {ObjectId} deletedBy - Reference to the user who triggered the deletion.
 * * @author Daniel Arapé
 */
const attemptSchema = new mongoose.Schema(
  {
    // --- User Identification and Context ---
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
      index: true,
    },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },

    // --- Attempt Results ---
    response: {
      type: mongoose.Schema.Types.Mixed,
      description: "User-submitted answer (text, option, etc.)",
    },
    isCorrect: {
      type: Boolean,
      description: "Whether the response was validated as correct",
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
      description: "Grade achieved (scale 0.0 to 1.0)",
    },
    timeTakenSec: {
      type: Number,
      description: "Seconds the user spent responding",
    },

    // --- Audit Snapshot ---
    planSnapshot: {
      tier: {
        type: String,
        description: "Plan level (free, plus, premium) at the time of the attempt",
      },
      at: { type: Date, default: Date.now },
    },

    // --- AI Evaluation (Optional) ---
    aiEvaluation: {
      aiRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "AiRequest" },
      tokensIn: { type: Number, default: 0 },
      tokensOut: { type: Number, default: 0 },
      costUsd: { type: Number, default: 0 },
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

const Attempt = mongoose.model("Attempt", attemptSchema);

export default Attempt;