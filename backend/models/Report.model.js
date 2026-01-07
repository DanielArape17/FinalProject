import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

reportSchema.plugin(mongoosePaginate);

/**
 * @description Reports Schema and Model (Moderation & Feedback)
 * @summary Manages complaints or alerts created by users regarding different 
 * system entities (routes, lessons, users). It provides a workflow for the 
 * moderation team, allowing them to track the status of each report from 
 * creation to resolution or rejection.
 * Includes: Workflow status system, polymorphic references, and auditing.
 * @prop {ObjectId} reporterId - Reference to the user issuing the complaint or alert.
 * @prop {string} targetType - The type of content reported (route, card, lesson, exercise, user).
 * @prop {ObjectId} targetId - Unique ID of the specific document being reported.
 * @prop {string} reason - Primary motive (e.g., 'Inaccurate content', 'Spam', 'Technical error').
 * @prop {string} details - Detailed explanation of the reported issue.
 * @prop {string} status - Moderation lifecycle state: 'open', 'in_review', 'resolved', 'rejected'.
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @prop {Date} deletedAt - Timestamp of logical deletion.
 * @prop {ObjectId} deletedBy - Reference to the user who performed the deletion.
 * @author Daniel Arapé
 */
const reportSchema = new mongoose.Schema(
  {
    // --- Report Author ---
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      description: "User who issues the complaint or alert",
    },

    // --- Report Target ---
    targetType: {
      type: String,
      required: true,
      enum: ["route", "card", "lesson", "exercise", "user"],
      description: "Type of content reported",
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      description: "ID of the specific document being reported",
    },

    // --- Report Content ---
    reason: {
      type: String,
      required: true,
      trim: true,
      description:
        "Primary motive (e.g. 'Inaccurate content', 'Spam', 'Technical error')",
    },
    details: {
      type: String,
      trim: true,
      description: "Extended explanation of the problem",
    },

    // --- Resolution Workflow ---
    status: {
      type: String,
      enum: ["open", "in_review", "resolved", "rejected"],
      default: "open",
      description: "Current state of the moderation process",
    },

    // --- Soft Delete ---
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;