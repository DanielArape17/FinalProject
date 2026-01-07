import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * @description Tokens Ledger Schema and Model (Virtual Currency Accounting)
 * @summary Records every movement (inflow or outflow) of tokens within the platform.
 * Enables financial traceability, auditing of purchases and rewards, and 
 * ensures that the user's balance is auditable at all times.
 * Includes: Change log (+/-), historical balance, and transaction motives.
 * @prop {ObjectId} userId - Reference to the user who owns the tokens.
 * @prop {number} change - Amount of tokens added (+) or subtracted (-).
 * @prop {number} balanceAfter - User's total balance immediately after this operation.
 * @prop {string} reason - Legal or technical motive: 'purchase', 'ad_reward', 'unlock_card', etc.
 * @prop {ObjectId} relatedId - ID of the related document (e.g., Purchase ID or Card ID).
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @prop {Date} deletedAt - Timestamp of logical deletion.
 * @prop {ObjectId} deletedBy - Reference to the user who performed the deletion.
 * @author Daniel Arapé
 */
const tokensLedgerSchema = new mongoose.Schema(
  {
    // --- Owner Reference ---
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      description: "User who owns the tokens",
    },

    // --- Transaction Details ---
    change: {
      type: Number,
      required: true,
      description: "Amount of tokens added (+) or subtracted (-)",
    },
    balanceAfter: {
      type: Number,
      required: true,
      description:
        "User's total balance immediately after this operation",
    },

    reason: {
      type: String,
      required: true,
      enum: ["purchase", "ad_reward", "unlock_card", "admin_adj", "refund"],
      description: "Legal or technical reason for the movement",
    },

    relatedId: {
      type: Schema.Types.ObjectId,
      default: null,
      description:
        "ID of the related document (e.g., Purchase ID or Card ID)",
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

const TokensLedger = mongoose.model("TokensLedger", tokensLedgerSchema);

export default TokensLedger;