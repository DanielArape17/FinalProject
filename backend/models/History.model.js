import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

historySchema.plugin(mongoosePaginate);

/**
 * @description History Schema and Model (Audit Trail)
 * @summary Records detailed logs of every operation performed on database 
 * documents (routes, cards, etc.). Enables version control, technical 
 * auditing, and data recovery by storing deltas (diffs) and snapshots 
 * of before and after states.
 * Includes: Full traceability, document snapshots, and change authorship.
 * @prop {string} collectionName - Name of the affected collection (e.g., 'routes', 'cards').
 * @prop {ObjectId} documentId - Reference to the specific modified document.
 * @prop {string} operation - Type of action: 'create', 'update', 'softDelete', etc.
 * @prop {ObjectId} userId - User who performed the action. Null if system/AI-triggered.
 * @prop {Mixed} diff - Object containing the changes (from -> to).
 * @prop {Mixed} fullDocumentBefore - Complete copy of the document before the change.
 * @prop {Mixed} fullDocumentAfter - Complete copy of the document after the change.
 * @prop {string} reason - Justification for the modification.
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @prop {Date} deletedAt - Timestamp of logical deletion.
 * @prop {ObjectId} deletedBy - Reference to the user who performed the deletion.
 * @author Daniel Arapé
 */
const historySchema = new mongoose.Schema(
  {
    // --- Document Reference ---
    collectionName: {
      type: String,
      required: true,
      trim: true,
      description: "Name of the affected collection (e.g. 'routes', 'cards')",
    },
    documentId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // --- Operation Details ---
    operation: {
      type: String,
      required: true,
      enum: [
        "create",
        "update",
        "softDelete",
        "hardDelete",
        "version",
        "restore",
        "meta",
      ],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      description: "User who performed the action. Null if it was system/AI.",
    },

    // --- Audit Data (Deltas and Snapshots) ---
    diff: {
      type: Schema.Types.Mixed,
      description: "Object with the changes made (from -> to)",
    },
    fullDocumentBefore: {
      type: Schema.Types.Mixed,
      default: null,
      description: "Full copy of the document before the change",
    },
    fullDocumentAfter: {
      type: Schema.Types.Mixed,
      default: null,
      description: "Full copy of the document after the change",
    },

    reason: {
      type: String,
      default: null,
      trim: true,
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

const History = mongoose.model("History", historySchema);

export default History;