import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * Modelo de Intentos (Attempt)
 * ----------------------------
 * Registra cada ejecución de un ejercicio por parte de un usuario.
 * Almacena la respuesta enviada, la calificación obtenida y el tiempo
 * empleado. Incluye un snapshot del plan del usuario y los costos de
 * evaluación si fue procesado por IA.
 * Integra: Trazabilidad de respuestas, métricas de desempeño y auditoría.
 * Autor: Daniel Arapé
 */
const attemptSchema = new mongoose.Schema(
  {
    // --- Identificación del Usuario y Contexto ---
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
      index: true,
    },
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson" },
    cardId: { type: Schema.Types.ObjectId, ref: "Card" },

    // --- Resultados del Intento ---
    response: {
      type: Schema.Types.Mixed,
      description: "Respuesta enviada por el usuario (texto, opción, etc.)",
    },
    isCorrect: {
      type: Boolean,
      description: "¿La respuesta fue validada como correcta?",
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
      description: "Puntaje obtenido (escala 0.0 a 1.0)",
    },
    timeTakenSec: {
      type: Number,
      description: "Segundos que tardó el usuario en responder",
    },

    // --- Snapshot de Auditoría ---
    planSnapshot: {
      tier: {
        type: String,
        description:
          "Nivel del plan (free, plus, premium) al momento del intento",
      },
      at: { type: Date, default: Date.now },
    },

    // --- Evaluación por IA (Opcional) ---
    aiEvaluation: {
      aiRequestId: { type: Schema.Types.ObjectId, ref: "AiRequest" },
      tokensIn: { type: Number, default: 0 },
      tokensOut: { type: Number, default: 0 },
      costUsd: { type: Number, default: 0 },
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

const Attempt = mongoose.model("Attempt", attemptSchema);

export default Attempt;
