import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.plugin(mongoosePaginate);

/**
 * Modelo de Recursos Multimedia (Media)
 * -------------------------------------
 * Centraliza la gestión de archivos externos vinculados a lecciones, 
 * usuarios o rutas. Almacena las referencias (URLs) a servicios de 
 * almacenamiento en la nube y metadatos técnicos específicos según 
 * el tipo de archivo (dimensiones, duración, etc.).
 * Integra: Soporte multi-formato, control de subida y metadatos.
 * Autor: Daniel Arapé
 */
const mediaSchema = new mongoose.Schema({
    // --- Autor de la Subida ---
    uploaderId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        index: true,
        description: "Usuario o administrador que subió el archivo"
    },

    // --- Identificación del Archivo ---
    type: { 
        type: String, 
        enum: ['image', 'audio', 'video', 'pdf', 'other'], 
        default: 'audio' 
    },
    url: { 
        type: String, 
        required: true,
        trim: true,
        description: "URL absoluta del archivo en el servidor de almacenamiento"
    },

    // --- Metadatos Técnicos ---
    metadata: {
        width: { type: Number, description: "Ancho en píxeles (solo para imágenes/video)" },
        height: { type: Number, description: "Alto en píxeles (solo para imágenes/video)" },
        durationSec: { type: Number, description: "Duración en segundos (solo para audio/video)" },
        sizeBytes: { type: Number, description: "Tamaño del archivo en bytes" } // Agregado por seguridad
    },

    // --- Control de Borrado Lógico ---
    deleted: { type: Boolean, default: false },    
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }

}, { 
    timestamps: true 
});

const Media = mongoose.model('Media', mediaSchema);

export default Media;