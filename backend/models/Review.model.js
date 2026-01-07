import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

ReviewSchema.plugin(mongoosePaginate);

/**
 * Modelo de Reseñas (Reviews y Calificaciones)
 * -------------------------------------------
 * Almacena las valoraciones numéricas y comentarios de los usuarios sobre
 * el contenido educativo. Es fundamental para el algoritmo de recomendación
 * y para identificar qué contenidos generados por la IA necesitan mejora.
 * Integra: Validación de rango (1-5), sistema de comentarios y auditoría.
 * Autor: Daniel Arapé
 */
const ReviewSchema = new mongoose.Schema(
  {
    // --- Autor de la Reseña ---
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      description: "Usuario que califica el contenido",
    },

    // --- Objetivo de la Calificación ---
    targetType: {
      type: String,
      required: true,
      enum: ["route", "card", "lesson"],
      description: "Tipo de entidad calificada",
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      description: "ID del documento específico (Ruta, Tarjeta o Lección)",
    },

    // --- Valoración ---
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      description: "Puntuación de 1 a 5 estrellas",
    },
    comment: {
      type: String,
      trim: true,
      description: "Comentario opcional del usuario sobre su experiencia",
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

const Review = mongoose.model("Review", reviewSchema);

export default Review;
