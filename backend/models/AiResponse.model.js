import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * Modelo de Respuestas de IA (AiResponse)
 * ---------------------------------------
 * Almacena el resultado final entregado por el modelo de IA. Contiene tanto
 * el texto plano como la estructura JSON parseada necesaria para construir
 * las rutas y tarjetas. Además, registra métricas de consumo (tokens) y
 * costos financieros para el control administrativo.
 * Integra: Almacenamiento estructurado, métricas de tokens y costos.
 * Autor: Daniel Arapé
 */
const aiResponseSchema = new mongoose.Schema(
  {
    // --- Vínculo con la Petición ---
    aiRequestId: {
      type: Schema.Types.ObjectId,
      ref: "AiRequest",
      required: true,
      unique: true,
      index: true,
      description:
        "Referencia a la pregunta original que generó esta respuesta",
    },

    // --- Contenido Generado ---
    responseText: {
      type: String,
      description: "Respuesta cruda en texto plano",
    },
    structured: {
      type: Schema.Types.Mixed,
      description:
        "JSON parseado (ej: el objeto con títulos de tarjetas y lecciones)",
    },

    // --- Métricas de Consumo y Costo ---
    tokensIn: {
      type: Number,
      default: 0,
      description: "Tokens de entrada (el tamaño del prompt)",
    },
    tokensOut: {
      type: Number,
      default: 0,
      description: "Tokens de salida (el tamaño de la respuesta)",
    },
    costUsd: {
      type: Number,
      default: 0,
      description: "Costo calculado en USD según la tarifa del proveedor",
    },

    // --- Metadatos Técnicos ---
    providerMeta: {
      type: Schema.Types.Mixed,
      description:
        "Respuesta completa y cruda del proveedor para auditoría técnica",
    },
    cached: {
      type: Boolean,
      default: false,
      description: "Indica si este resultado se sirvió desde el caché",
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

const AiResponse = mongoose.model("AiResponse", aiResponseSchema);

export default AiResponse;
