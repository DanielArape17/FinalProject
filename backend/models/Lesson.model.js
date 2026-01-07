import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.plugin(mongoosePaginate);

/**
 * Modelo de Lección (Lesson)
 * --------------------------
 * Almacena el contenido educativo detallado vinculado a una tarjeta.
 * Organiza la información en secciones, integra recursos multimedia,
 * ejercicios interactivos y flashcards para el estudio activo. 
 * Integra: Contenido estructurado, soporte multimedia y métricas de IA.
 * Autor: Daniel Arapé
 */
const lessonSchema = new mongoose.Schema({
    // --- Vínculo Estructural ---
    cardId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Card', 
        required: true,
        index: true,
        description: "Tarjeta a la que pertenece este contenido"
    },
    title: { 
        type: String, 
        trim: true 
    },

    // --- Configuración Pedagógica ---
    level: { 
        type: String, 
        enum: ['principiante', 'intermedio', 'avanzado'], 
        default: 'intermedio' 
    },
    lessonPlan: { 
        type: String, 
        trim: true,
        description: "Estructura instruccional y secuencia lógica de la lección (ej: 'summary+flashcards+quiz')" 
    },

    // --- Cuerpo de la Lección ---
    sections: [{
        title: { type: String, trim: true },
        body: { 
            type: String, 
            description: "Contenido principal en formato Markdown o HTML" 
        },
        resources: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'Media',
            description: "Imágenes, PDFs o archivos específicos de esta sección"
        }],
        exercises: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'Exercise',
            description: "Preguntas o retos prácticos vinculados a esta sección"
        }]
    }],

    // --- Herramientas de Estudio Activo ---
    flashcards: [{
        q: { type: String, trim: true, description: "Pregunta o concepto" },
        a: { type: String, trim: true, description: "Respuesta o definición" }
    }],

    // --- Recursos Globales y Auditoría ---
    resources: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Media',
        description: "Material descargable general de la lección"
    }],
    aiUsageCost: {
        inputTokens: { type: Number, default: 0 },
        outputTokens: { type: Number, default: 0 },
        costUsd: { type: Number, default: 0 }
    },

    // --- Control de Borrado Lógico ---
    deleted: { type: Boolean, default: false },    
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }

}, { 
    timestamps: true 
});

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;