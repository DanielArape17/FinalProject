import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

ReviewSchema.plugin(mongoosePaginate);

/**
 * @description Reviews and Ratings Schema and Model (Review)
 * @summary Stores numerical ratings and user feedback regarding educational content. 
 * This data is essential for the recommendation algorithm and for identifying 
 * AI-generated content that requires improvement.
 * Includes: Range validation (1-5), feedback system, and auditing.
 * @prop {ObjectId} userId - Reference to the user rating the content.
 * @prop {string} targetType - Type of the rated entity: 'route', 'card', or 'lesson'.
 * @prop {ObjectId} targetId - Unique ID of the specific document (Route, Card, or Lesson).
 * @prop {number} rating - Score from 1 to 5 stars.
 * @prop {string} comment - Optional user feedback regarding their experience.
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @prop {Date} deletedAt - Timestamp of logical deletion.
 * @prop {ObjectId} deletedBy - Reference to the user who performed the deletion.
 * @author Daniel Arapé
 */
const ReviewSchema = new mongoose.Schema(
  {
    // --- Review Author ---
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      description: "User providing the rating",
    },

    // --- Rating Target ---
    targetType: {
      type: String,
      required: true,
      enum: ["route", "card", "lesson"],
      description: "Type of the entity being rated",
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      description: "Specific document ID (Route, Card, or Lesson)",
    },

    // --- Evaluation ---
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      description: "Star rating from 1 to 5",
    },
    comment: {
      type: String,
      trim: true,
      description: "Optional user feedback regarding their experience",
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

const Review = mongoose.model("Review", reviewSchema);

export default Review;