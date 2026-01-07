import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

AdminLogSchema.plugin(mongoosePaginate);

/**
 * Modelo de Registro de Auditoría Administrativa (AdminLog)
 * --------------------------------------------------------
 * Almacena las acciones críticas realizadas por administradores o moderadores.
 * Permite rastrear la actividad de gestión humana sobre usuarios, rutas
 * y configuraciones del sistema, asegurando la responsabilidad y el control.
 * Integra: Identificación del actor, descripción de la acción y contexto del cambio.
 * Autor: Daniel Arapé
 */

const adminLogSchema = new mongoose.Schema(
  {
    // --- Actor de la Acción ---
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      description: "Administrador o moderador que ejecutó la acción",
    },

    // --- Descripción de la Operación ---
    action: {
      type: String,
      required: true,
      trim: true,
      description: "Ej: 'user.ban', 'tokens.refund', 'plan.update'",
    },

    // --- Objetivo del Cambio ---
    targetType: {
      type: String,
      required: true,
      description: "Tipo de entidad que fue afectada",
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      description: "ID específico del documento afectado",
    },

    // --- Detalles Complementarios ---
    details: {
      type: Schema.Types.Mixed,
      description:
        "Objeto con información adicional sobre la acción (ej. motivo, valores previos)",
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
