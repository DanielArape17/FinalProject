import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.plugin(mongoosePaginate);

/**
 * Modelo de Ejercicios (Exercise)
 * ------------------------------
 * Define los retos interactivos y evaluaciones dentro de una lección.
 * Soporta múltiples formatos de pregunta y gestiona la lógica de evaluación
 * (pesos, dificultad y límites de tiempo). El campo 'payload' es flexible 
 * para adaptarse a la estructura requerida por el frontend para cada tipo.
 * Integra: Tipos dinámicos, ponderación de puntaje y metadatos evaluativos.
 * Autor: Daniel Arapé
 */
const exerciseSchema = new mongoose.Schema({
    // --- Contexto Educativo ---
    lessonId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Lesson', 
        required: true,
        index: true,
        description: "Lección específica a la que pertenece el ejercicio"
    },
    cardId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Card', 
        required: true,
        index: true,
        description: "Tarjeta contenedora para facilitar la navegación"
    },

    // --- Configuración del Reto ---
    type: { 
        type: String, 
        required: true, 
        enum: ['multiple_choice', 'fill_blank', 'matching', 'drag_drop', 'open_text', 'flashcard'],
        description: "Formato técnico del ejercicio"
    },
    
    payload: { 
        type: Schema.Types.Mixed, 
        required: true,
        description: "JSON con pregunta, opciones y respuestas correctas"
    },

    // --- Evaluación y Dificultad ---
    weight: { 
        type: Number, 
        default: 1.0,
        description: "Multiplicador para el cálculo de dominio (mastery)" 
    },
    difficulty: { 
        type: String, 
        enum: ['bajo', 'medio', 'alto'], 
        default: 'medio' 
    },
    
    metadata: {
        timeLimitSec: { 
            type: Number, 
            description: "Tiempo máximo para completar (solo para exámenes)" 
        }
    },

    // --- Control de Borrado Lógico ---
    deleted: { type: Boolean, default: false },    
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }

}, { 
    timestamps: true 
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;