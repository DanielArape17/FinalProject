import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

HistorySchema.plugin(mongoosePaginate);

/**
 * Modelo de Historial (Audit Trail)
 * ---------------------------------
 * Registra de forma detallada cada operación realizada sobre los documentos
 * de la base de datos (rutas, tarjetas, etc.). Permite el control de versiones,
 * auditoría técnica y recuperación de datos mediante el almacenamiento de
 * deltas (diffs) y snapshots del antes y después.
 * Integra: Trazabilidad completa, snapshots de documentos y autoría de cambios.
 * Autor: Daniel Arapé
 */
const historySchema = new mongoose.Schema(
  {
    // --- Referencia del Documento ---
    collectionName: {
      type: String,
      required: true,
      trim: true,
      description: "Nombre de la colección afectada (ej. 'routes', 'cards')",
    },
    documentId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // --- Detalles de la Operación ---
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
      description: "Usuario que realizó la acción. Null si fue el sistema/IA.",
    },

    // --- Datos de Auditoría (Deltas y Snapshots) ---
    diff: {
      type: Schema.Types.Mixed,
      description: "Objeto con los cambios realizados (de -> hacia)",
    },
    fullDocumentBefore: {
      type: Schema.Types.Mixed,
      default: null,
      description: "Copia completa del documento antes del cambio",
    },
    fullDocumentAfter: {
      type: Schema.Types.Mixed,
      default: null,
      description: "Copia completa del documento después del cambio",
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
