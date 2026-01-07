import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.plugin(mongoosePaginate);

/**
 * Modelo de Tarjeta Educativa (Card)
 * ----------------------------------
 * Representa un hito o paso específico dentro de una ruta de aprendizaje.
 * Gestiona el orden de los contenidos, los prerrequisitos de acceso basados
 * en puntajes previos, y vincula la tarjeta con su contenido real (lecciones).
 * Integra: Lógica de prerrequisitos, metadatos de dificultad y costos de IA.
 * Autor: Daniel Arapé
 */
const cardSchema = new mongoose.Schema({
    // --- Estructura de la Ruta ---
    routeId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Route', 
        required: true,
        index: true,
        description: "Ruta a la que pertenece esta tarjeta"
    },
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    order: { 
        type: Number, 
        default: 0,
        description: "Posición secuencial dentro de la ruta" 
    },
    type: { 
        type: String, 
        enum: ['lesson', 'checkpoint', 'exercise_bundle', 'info'], 
        default: 'lesson' 
    },

    // --- Referencias de Contenido ---
    contentRef: {
        lessonId: { 
            type: Schema.Types.ObjectId, 
            ref: 'Lesson',
            description: "Puntero al contenido detallado (lección o ejercicios)"
        }
    },

    // --- Lógica de Aprendizaje (Gamificación) ---
    prerequisites: [{
        cardId: { type: Schema.Types.ObjectId, ref: 'Card' },
        requiredScore: { 
            type: Number, 
            default: 0, 
            min: 0, 
            max: 1,
            description: "Puntaje necesario (0.0 a 1.0) para desbloquear esta tarjeta" 
        }
    }],

    // --- Información y Metadatos ---
    summary: { 
        type: String, 
        trim: true 
    },
    metadata: {
        durationMin: { type: Number, default: 0 },
        difficulty: { 
            type: String, 
            enum: ['bajo', 'medio', 'alto'],
            default: 'medio'
        }
    },

    // --- Auditoría de IA y Calidad ---
    aiUsageCost: {
        inputTokens: { type: Number, default: 0 },
        outputTokens: { type: Number, default: 0 },
        costUsd: { type: Number, default: 0 }
    },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    // --- Control de Borrado Lógico ---
    deleted: { type: Boolean, default: false },    
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }

}, { 
    timestamps: true 
});

const Card = mongoose.model('Card', cardSchema);

export default Card;