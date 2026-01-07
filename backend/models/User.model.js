import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.plugin(mongoosePaginate);

/**
 * Modelo de Usuario - Proyecto Final
 * ---------------------------------
 * Representa la entidad central del sistema. Gestiona la autenticación,
 * niveles académicos para la IA, saldos de tokens y preferencias de
 * personalización. Incluye seguridad avanzada (MFA y bloqueo de cuenta),
 * rastreo de progreso en rutas y soporte para borrado lógico.
 * Integra: Seguridad, Planes de Suscripción, Preferencias de IA y Progreso.
 * Autor: Daniel Arapé
 */
const userSchema = new mongoose.Schema(
  {
    // --- Datos de Identidad ---
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "El formato del correo es inválido.",
      },
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook", "apple"],
      default: "local",
    },
    // -- Security --
    passwordHash: { type: String, select: false },
    passwordHistory: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 3,
        message: "No se pueden reutilizar las últimas 3 contraseñas.",
      },
    },

		// -- Porfile --
    name: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => /^[A-Za-záéíóúÁÉÍÓÚñÑ' ]+$/.test(v),
        message: "El nombre solo puede contener letras.",
      },
    },
    country: { type: String },
    language: { type: String, default: "es" },
    academicLevel: {
      type: String,
      enum: [
        "primaria",
        "secundaria",
        "bachillerato",
        "grado",
        "postgrado",
        "otros",
      ],
      default: "otros",
    },
    role: {
      type: String,
      enum: ["user", "moderator", "revisor", "admin", "superadmin"],
      default: "user",
    },

    // --- Monetización y Tokens ---
    plan: {
      tier: {
        type: String,
        enum: ["free", "plus", "premium", "pro", "b2b"],
        default: "free",
      },
      since: { type: Date },
      expiresAt: { type: Date },
    },
    tokensBalance: { type: Number, default: 0, min: 0 },

    // --- Personalización y Preferencias ---
    preferences: {
      notifications: {
        progress: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false },
        security: { type: Boolean, default: true },
      },
      ui: {
        theme: {
          type: String,
          enum: ["light", "dark", "auto"],
          default: "auto",
        },
        fontSize: { type: String, enum: ["sm", "md", "lg"], default: "md" },
      },
      aiPersonalization: {
        consent: { type: Boolean, default: true },
        allowedCulturalExamples: { type: Boolean, default: true },
        keywords: { type: [String], default: [] },
      },
    },

    // --- Tracking de Progreso ---
    progress: {
      routes: [
        {
          routeId: { type: Schema.Types.ObjectId, ref: "Route" },
          percent: { type: Number, default: 0, min: 0, max: 100 },
          lastVisitedAt: { type: Date },
        },
      ],
    },

    // --- Seguridad y Auditoría ---
    security: {
      mfaEnabled: { type: Boolean, default: false },
      lastLoginAt: { type: Date },
      failedLogins: { type: Number, default: 0 },
      lockedUntil: { type: Date },
    },

    // --- Control Administrativo y Borrado Lógico ---
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
