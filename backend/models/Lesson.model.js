import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * @description Educational Lesson Schema and Model (Lesson)
 * @summary Stores detailed educational content linked to a specific card.
 * Organizes information into sections, integrates multimedia resources,
 * interactive exercises, and flashcards for active study.
 * Includes: Structured content, multimedia support, and AI usage metrics.
 * @prop {ObjectId} cardId - Reference to the card this content belongs to.
 * @prop {string} title - The display name of the lesson.
 * @prop {string} level - Pedagogical difficulty: 'beginner', 'intermediate', or 'advanced'.
 * @prop {string} lessonPlan - Instructional structure (e.g., 'summary+flashcards+quiz').
 * @prop {Array} sections - Main body components including text, media, and exercises.
 * @prop {Array} flashcards - Concept-answer pairs for active recall study.
 * @prop {Array} resources - General downloadable materials and global media.
 * @prop {Object} aiUsageCost - Tracking for input/output tokens and financial cost in USD.
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @prop {Date} deletedAt - Timestamp of logical deletion.
 * @prop {ObjectId} deletedBy - Reference to the user who performed the deletion.
 * @author Daniel Arapé
 */
const lessonSchema = new mongoose.Schema(
  {
    // --- Structural Link ---
    cardId: {
      type: Schema.Types.ObjectId,
      ref: "Card",
      required: true,
      index: true,
      description: "Parent card associated with this lesson",
    },
    title: {
      type: String,
      trim: true,
    },

    // --- Pedagogical Configuration ---
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    lessonPlan: {
      type: String,
      trim: true,
      description:
        "Instructional sequence logic (e.g. 'summary+flashcards+quiz')",
    },

    // --- Lesson Body ---
    sections: [
      {
        title: { type: String, trim: true },
        body: {
          type: String,
          description: "Main content in Markdown or HTML format",
        },
        resources: [
          {
            type: Schema.Types.ObjectId,
            ref: "Media",
            description: "Section-specific images, PDFs, or files",
          },
        ],
        exercises: [
          {
            type: Schema.Types.ObjectId,
            ref: "Exercise",
            description:
              "Practical challenges or questions linked to this section",
          },
        ],
      },
    ],

    // --- Active Study Tools ---
    flashcards: [
      {
        q: { type: String, trim: true, description: "Question or concept" },
        a: { type: String, trim: true, description: "Answer or definition" },
      },
    ],

    // --- Global Resources and Audit ---
    resources: [
      {
        type: Schema.Types.ObjectId,
        ref: "Media",
        description: "General downloadable materials for the lesson",
      },
    ],
    aiUsageCost: {
      inputTokens: { type: Number, default: 0 },
      outputTokens: { type: Number, default: 0 },
      costUsd: { type: Number, default: 0 },
    },

    // --- Logical Deletion Control ---
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
