import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * @description Administrative Audit Log Schema and Model (AdminLog)
 * @summary Stores critical actions performed by administrators or moderators.
 * Allows tracking of human management activities over users, routes, and
 * system configurations, ensuring accountability and control.
 * Includes: Actor identification, action description, and change context.
 * @prop {ObjectId} actorId - Reference to the administrator or moderator who executed the action.
 * @prop {string} action - Operation identifier (e.g., 'user.ban', 'tokens.refund', 'plan.update').
 * @prop {string} targetType - The type of entity that was affected by the action.
 * @prop {ObjectId} targetId - Specific ID of the document that was modified.
 * @prop {Mixed} details - Object containing additional information (e.g., reason, previous values).
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @prop {Date} deletedAt - Timestamp of logical deletion.
 * @prop {ObjectId} deletedBy - Reference to the user who performed the deletion.
 * @author Daniel Arapé
 */
const AdminLogSchema = new Schema(
  {
    // --- Action Actor ---
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      description: "Administrator or moderator who executed the action",
    },

    // --- Operation Description ---
    action: {
      type: String,
      required: true,
      trim: true,
      description: "e.g., 'user.ban', 'tokens.refund', 'plan.update'",
    },

    // --- Change Target ---
    targetType: {
      type: String,
      required: true,
      description: "Type of entity that was affected",
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      description: "Specific ID of the affected document",
    },

    // --- Complementary Details ---
    details: {
      type: Schema.Types.Mixed,
      description:
        "Object with additional info about the action (e.g. reason, previous values)",
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

const AdminLog = mongoose.model("AdminLog", AdminLogSchema);

export default AdminLog;
