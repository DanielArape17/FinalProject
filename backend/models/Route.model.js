import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * Modelo de Ruta de Aprendizaje (Route)
 * ------------------------------------
 * Representa el contenedor principal de una ruta educativa. Almacena la
 * estructura de tarjetas, el control de versiones, metadatos de dificultad,
 * y estadísticas de consumo de IA. Es el eje central que conecta a los
 * usuarios con el contenido generado.
 * Integra: Gestión de versiones, contador de tarjetas y métricas de calidad.
 * Autor: Daniel Arapé
 */
const routeSchema = new mongoose.Schema(
  {
    // --- Información Básica ---
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
      description:
        "Etiqueta principal del tema (ej: 'Programación', 'Historia')",
    },
    description: {
      type: String,
      trim: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      description:
        "Creador de la ruta. Null indica que fue generada por el sistema/IA.",
    },

    // --- Estructura y Versiones ---
    cardIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Card",
      },
    ],
    cardCount: {
      type: Number,
      default: 0,
    },
    currentVersion: {
      type: Number,
      default: 1,
    },
    latestVersionId: {
      type: Schema.Types.ObjectId,
      ref: "RouteVersion",
      description: "Referencia al documento de historial de versiones",
    },

    // --- Clasificación y Metadatos ---
    tags: [String],
    language: {
      type: String,
      default: "es",
    },
    metadata: {
      estimatedDurationMin: { type: Number, default: 0 },
      difficulty: {
        type: String,
        enum: ["bajo", "medio", "alto"],
        default: "medio",
      },
      createdFromPrompt: {
        type: String,
        description: "Texto original del prompt que dio origen a esta ruta",
      },
    },

    // --- Estadísticas de IA (Costos) ---
    tokenUsage: {
      inputTokens: { type: Number, default: 0 },
      outputTokens: { type: Number, default: 0 },
      costUsd: { type: Number, default: 0 },
      lastUpdatedAt: { type: Date },
    },

    // --- Social y Estado ---
    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    isPremiumOnly: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
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

const Route = mongoose.model("Route", routeSchema);

export default Route;
