import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * @description Educational Exercise Schema and Model (Exercise)
 * @summary Defines interactive challenges and assessments within a lesson.
 * Supports multiple question formats and manages evaluation logic (weights,
 * difficulty, and time limits). The 'payload' field is flexible to adapt to
 * the structure required by the frontend for each specific exercise type.
 * Includes: Dynamic types, score weighting, and evaluative metadata.
 * * @prop {ObjectId} lessonId - Specific lesson reference this exercise belongs to.
 * @prop {ObjectId} cardId - Parent card reference to facilitate navigation.
 * @prop {string} type - Technical format: 'multiple_choice', 'fill_blank', 'matching', etc.
 * @prop {Mixed} payload - JSON object containing the question, options, and correct answers.
 * @prop {number} weight - Multiplier for mastery and grade calculations.
 * @prop {string} difficulty - Complexity level: 'low', 'medium', or 'high'.
 * @prop {number} metadata.timeLimitSec - Maximum completion time (mainly for exam mode).
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @prop {Date} deletedAt - Timestamp of logical deletion.
 * @prop {ObjectId} deletedBy - Reference to the user who performed the deletion.
 * * @author Daniel Arapé
 */
const exerciseSchema = new mongoose.Schema(
  {
    // --- Educational Context ---
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      index: true,
      description: "Specific lesson linked to this exercise",
    },
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
      index: true,
      description: "Container card for navigational context",
    },

    // --- Challenge Configuration ---
    type: {
      type: String,
      required: true,
      enum: [
        "multiple_choice",
        "fill_blank",
        "matching",
        "drag_drop",
        "open_text",
        "flashcard",
      ],
      description: "Technical format of the exercise UI/Logic",
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      description: "Dynamic JSON containing question data and validation keys",
    },

    // --- Evaluation and Difficulty ---
    weight: {
      type: Number,
      default: 1.0,
      description: "Multiplier for mastery (weighted score) calculation",
    },
    difficulty: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    metadata: {
      timeLimitSec: {
        type: Number,
        description: "Max duration allowed for completion (in seconds)",
      },
    },

    // --- Logical Deletion Control ---
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
