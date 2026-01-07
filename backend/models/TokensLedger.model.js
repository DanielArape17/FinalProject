import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * Modelo de Ledger de Tokens (Contabilidad de Moneda Virtual)
 * ---------------------------------------------------------
 * Registra cada movimiento (entrada o salida) de tokens en la plataforma.
 * Permite la trazabilidad financiera, auditoría de compras y recompensas,
 * y asegura que el saldo del usuario sea auditable en todo momento.
 * Integra: Registro de cambios (+/-), saldo histórico y motivos de transacción.
 * Autor: Daniel Arapé
 */
const tokensLedgerSchema = new mongoose.Schema(
  {
    // --- Referencia del Propietario ---
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      description: "Usuario dueño de los tokens",
    },

    // --- Detalles de la Transacción ---
    change: {
      type: Number,
      required: true,
      description: "Cantidad de tokens añadida (+) o restada (-)",
    },
    balanceAfter: {
      type: Number,
      required: true,
      description:
        "Saldo total del usuario inmediatamente después de esta operación",
    },

    reason: {
      type: String,
      required: true,
      enum: ["purchase", "ad_reward", "unlock_card", "admin_adj", "refund"],
      description: "Motivo legal o técnico del movimiento",
    },

    relatedId: {
      type: Schema.Types.ObjectId,
      default: null,
      description:
        "ID del documento relacionado (ej: ID de la compra o ID de la tarjeta)",
    },

    // --- Control de Borrado Lógico ---
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
