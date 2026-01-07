import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

PlanSchema.plugin(mongoosePaginate);

/**
 * Modelo de Plan (Suscripciones)
 * ---------------------------------
 * Define los diferentes niveles de servicio disponibles en la plataforma
 * (Free, Plus, Premium, Pro, B2B). Almacena los costos comerciales y,
 * lo más importante, los límites técnicos de la IA para cada nivel,
 * permitiendo un control estricto del consumo de recursos por usuario.
 * Integra: Gestión de precios, lista de beneficios y cuotas de uso (Rate Limiting).
 * Basado en: Estándares de monetización y borrado lógico.
 * Autor: Daniel Arapé
 */
const planSchema = new mongoose.Schema(
  {
    // --- Identificación del Plan ---
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      enum: ["free", "plus", "premium", "pro", "b2b"],
      description: "Nombre único del nivel de suscripción",
    },
    description: {
      type: String,
      trim: true,
    },

    // --- Estructura de Precios ---
    pricing: {
      monthlyUsd: { type: Number, default: 0, min: 0 },
      annualUsd: { type: Number, default: 0, min: 0 },
    },

    // --- Características y Marketing ---
    benefits: {
      type: [String],
      default: [],
      description:
        "Lista de funcionalidades incluidas para mostrar en el frontend",
    },

    // --- Límites Técnicos y de IA ---
    limits: {
      maxActiveRoutes: { type: Number, default: 1 },
      freeCardsPerRoute: { type: Number, default: 2 },
      rewardedAdsPerDay: { type: Number, default: 3 },
      tokensPerDay: { type: Number, default: 1000 },
      concurrentGenerations: { type: Number, default: 1 },
      priorityAI: { type: Boolean, default: false },
    },

    isActive: { type: Boolean, default: true },

    // --- Estado y Auditoría ---
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
