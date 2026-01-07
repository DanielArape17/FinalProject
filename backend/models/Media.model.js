import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * @description Multimedia Resources Schema and Model (Media)
 * @summary Centralizes the management of external files linked to lessons,
 * users, or routes. It stores references (URLs) to cloud storage services
 * and technical metadata specific to the file type (dimensions, duration, etc.).
 * Includes: Multi-format support, upload control, and metadata tracking.
 * @prop {ObjectId} uploaderId - Reference to the user or admin who uploaded the file.
 * @prop {string} type - File category: 'image', 'audio', 'video', 'pdf', or 'other'.
 * @prop {string} url - Absolute URL of the file in the storage server.
 * @prop {number} metadata.width - Width in pixels (images/video only).
 * @prop {number} metadata.height - Height in pixels (images/video only).
 * @prop {number} metadata.durationSec - Duration in seconds (audio/video only).
 * @prop {number} metadata.sizeBytes - File size in bytes.
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @prop {Date} deletedAt - Timestamp of logical deletion.
 * @prop {ObjectId} deletedBy - Reference to the user who performed the deletion.
 * @author Daniel Arapé
 */
const mediaSchema = new mongoose.Schema(
  {
    // --- Upload Author ---
    uploaderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      description: "User or administrator who uploaded the file",
    },

    // --- File Identification ---
    type: {
      type: String,
      enum: ["image", "audio", "video", "pdf", "other"],
      default: "audio",
    },
    url: {
      type: String,
      required: true,
      trim: true,
      description: "Absolute URL of the file in the storage server",
    },

    // --- Technical Metadata ---
    metadata: {
      width: {
        type: Number,
        description: "Width in pixels (images/video only)",
      },
      height: {
        type: Number,
        description: "Height in pixels (images/video only)",
      },
      durationSec: {
        type: Number,
        description: "Duration in seconds (audio/video only)",
      },
      sizeBytes: { type: Number, description: "File size in bytes" },
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

const Media = mongoose.model("Media", mediaSchema);

export default Media;
