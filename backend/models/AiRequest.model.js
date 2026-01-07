import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * Modelo de Solicitudes de IA (AiRequest)
 * --------------------------------------
 * Registra cada petición enviada a los modelos de lenguaje (LLMs). Almacena
 * el prompt enviado, el modelo utilizado, el proveedor y el estado de la
 * respuesta. Es esencial para el monitoreo de costos, depuración de errores
 * de generación y optimización mediante el uso de caché.
 * Integra: Trazabilidad de prompts, gestión de estados y metadatos técnicos.
 * Autor: Daniel Arapé
 */
const aiRequestSchema = new mongoose.Schema(
  {
    // --- Referencias de Contexto ---
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    routeId: { type: Schema.Types.ObjectId, ref: "Route", default: null },
    cardId: { type: Schema.Types.ObjectId, ref: "Card", default: null },
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", default: null },

    // --- Detalles de la Petición ---
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      description: "Ej: 'gpt-4o', 'gemini-1.5-pro', 'deepseek-v3'",
    },
    provider: {
      type: String,
      trim: true,
      description: "Ej: 'openai', 'google', 'anthropic'",
    },

    // --- Estado y Rendimiento ---
    status: {
      type: String,
      enum: ["pending", "done", "failed", "cached"],
      default: "pending",
    },
    cacheHit: {
      type: Boolean,
      default: false,
      description:
        "Indica si la respuesta fue recuperada de la base de datos sin llamar a la IA",
    },
    extra: {
      type: Schema.Types.Mixed,
      description:
        "Metadatos adicionales: tokens usados, tiempo de respuesta, errores de API",
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

const AiRequest = mongoose.model("AiRequest", aiRequestSchema);

export default AiRequest;
