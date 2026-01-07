import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

ReportSchema.plugin(mongoosePaginate);

/**
 * Modelo de Reportes (Moderación y Feedback)
 * ------------------------------------------
 * Gestiona las denuncias o alertas creadas por los usuarios sobre diferentes
 * entidades del sistema (rutas, lecciones, usuarios). Proporciona un flujo
 * de trabajo para el equipo de moderación, permitiendo rastrear el estado
 * de cada reporte desde su creación hasta su resolución o rechazo.
 * Integra: Sistema de estados (workflow), referencias polimórficas y auditoría.
 * Autor: Daniel Arapé
 */
const reportSchema = new mongoose.Schema(
  {
    // --- Autor del Reporte ---
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      description: "Usuario que emite la queja o alerta",
    },

    // --- Objetivo del Reporte ---
    targetType: {
      type: String,
      required: true,
      enum: ["route", "card", "lesson", "exercise", "user"],
      description: "Tipo de contenido reportado",
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      description: "ID del documento específico que está siendo reportado",
    },

    // --- Contenido del Reporte ---
    reason: {
      type: String,
      required: true,
      trim: true,
      description:
        "Motivo principal (ej: 'Contenido inexacto', 'Spam', 'Error técnico')",
    },
    details: {
      type: String,
      trim: true,
      description: "Explicación extendida del problema",
    },

    // --- Flujo de Resolución ---
    status: {
      type: String,
      enum: ["open", "in_review", "resolved", "rejected"],
      default: "open",
      description: "Estado actual del proceso de moderación",
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
