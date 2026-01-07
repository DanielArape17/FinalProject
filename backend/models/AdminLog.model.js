import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

AdminLogSchema.plugin(mongoosePaginate);

/**
 * @description Administrative Audit Log Schema and Model
 * @summary Stores critical actions performed by administrators or moderators.
 * This model enables activity tracking regarding user management, system routes, 
 * and configuration changes, ensuring accountability and forensic control.
 * @prop {ObjectId} actorId - Reference to the administrator/moderator who performed the action.
 * @prop {string} action - Action identifier (e.g., 'user.ban', 'tokens.refund', 'plan.update').
 * @prop {string} targetType - Type of entity/resource affected by the operation.
 * @prop {ObjectId} targetId - Unique identifier of the specific document affected.
 * @prop {Mixed} details - Metadata containing contextual info (reasoning, previous/new values).
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @prop {Date} deletedAt - Timestamp recording when the record was logically removed.
 * @prop {ObjectId} deletedBy - Reference to the user who authorized the logical deletion.
 * @timestamps createdAt and updatedAt generated automatically.
 * @author Daniel Arapé (Standardized by Dev Team)
 */

const adminLogSchema = new mongoose.Schema(
  {
    // --- Action Actor ---
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      description: "Admin or moderator responsible for the entry",
    },

    // --- Operation Details ---
    action: {
      type: String,
      required: true,
      trim: true,
      description: "Action namespace using dot notation for categorization",
    },

    // --- Target Identification ---
    targetType: {
      type: String,
      required: true,
      description: "Resource entity name (e.g., 'User', 'Payment', 'Route')",
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      description: "Direct reference to the affected document ID",
    },

    // --- Contextual Metadata ---
    details: {
      type: Schema.Types.Mixed,
      description:
        "Payload containing the diff or justification for the change",
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

const AdminLog = mongoose.model("AdminLog", adminLogSchema);

export default AdminLog;
