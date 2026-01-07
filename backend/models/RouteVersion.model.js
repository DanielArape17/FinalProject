import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * Modelo de Versiones de Ruta (RouteVersion)
 * -----------------------------------------
 * Almacena instantáneas (snapshots) completas de una ruta en un momento dado.
 * Permite mantener un historial de cambios, facilitar la recuperación de
 * datos (rollback) y auditar la evolución del contenido generado por la IA.
 * Integra: Snapshot de contenido, trazabilidad de versiones y métricas de IA.
 * Autor: Daniel Arapé
 */
const routeVersionSchema = new mongoose.Schema(
  {
    // --- Vínculo con la Ruta Principal ---
    routeId: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      required: true,
      index: true,
      description: "ID de la ruta a la que pertenece esta versión",
    },
    version: {
      type: Number,
      required: true,
      description: "Número secuencial de la versión (ej: 1, 2, 3...)",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      description:
        "Usuario que solicitó la nueva versión (null si fue automático)",
    },

    // --- Instantánea del Contenido (Snapshot) ---
    contentSnapshot: {
      title: { type: String, trim: true },
      summary: { type: String, trim: true },
      cards: [
        {
          cardId: { type: Schema.Types.ObjectId, ref: "Card" },
          title: { type: String, trim: true },
          summary: { type: String, trim: true },
          order: { type: Number },
        },
      ],
    },

    // --- Métricas y Auditoría de IA ---
    tokenUsage: {
      inputTokens: { type: Number, default: 0 },
      outputTokens: { type: Number, default: 0 },
    },
    cacheKey: {
      type: String,
      trim: true,
      description:
        "Llave de caché utilizada para evitar generaciones duplicadas",
    },
    note: {
      type: String,
      trim: true,
      description:
        "Comentario interno (ej: 'Regeneración por actualización de prompt')",
    },
  },
  {
    timestamps: true,
  }
);

const RouteVersion = mongoose.model("RouteVersion", routeVersionSchema);

export default RouteVersion;
