import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.plugin(mongoosePaginate);

/**
 * @description Educational Card Schema and Model (Card)
 * @summary Represents a specific milestone or step within a learning path (Route).
 * Manages content sequencing, access prerequisites based on previous scores, 
 * and links the card to its actual instructional content (lessons).
 * Includes: Prerequisite logic, difficulty metadata, and AI-related costs.
 * * @prop {ObjectId} routeId - Reference to the learning path this card belongs to.
 * @prop {string} title - The display name of the card.
 * @prop {number} order - Sequential position of the card within its route.
 * @prop {string} type - Card classification: 'lesson', 'checkpoint', 'exercise_bundle', or 'info'.
 * @prop {ObjectId} contentRef.lessonId - Pointer to the detailed instructional content or exercises.
 * @prop {Array} prerequisites - List of cards and required scores (0.0 - 1.0) to unlock this card.
 * @prop {string} summary - Brief overview of the card's purpose.
 * @prop {number} metadata.durationMin - Estimated time in minutes to complete the card.
 * @prop {string} metadata.difficulty - Complexity level: 'low', 'medium', or 'high'.
 * @prop {Object} aiUsageCost - Tracking for input/output tokens and financial cost in USD.
 * @prop {number} ratingAvg - Average user rating for this card.
 * @prop {number} ratingCount - Total number of ratings received.
 * @prop {boolean} deleted - Logical deletion flag (Soft Delete).
 * @prop {Date} deletedAt - Timestamp of logical deletion.
 * @prop {ObjectId} deletedBy - Reference to the user who performed the deletion.
 * * @author Daniel Arapé
 */
const cardSchema = new mongoose.Schema({
    // --- Route Structure ---
    routeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Route', 
        required: true,
        index: true,
        description: "The Route ID associated with this card"
    },
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    order: { 
        type: Number, 
        default: 0,
        description: "Sequential index for sorting within a route" 
    },
    type: { 
        type: String, 
        enum: ['lesson', 'checkpoint', 'exercise_bundle', 'info'], 
        default: 'lesson' 
    },

    // --- Content References ---
    contentRef: {
        lessonId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Lesson',
            description: "Pointer to the specific lesson or content document"
        }
    },

    // --- Learning Logic (Gamification) ---
    prerequisites: [{
        cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
        requiredScore: { 
            type: Number, 
            default: 0, 
            min: 0, 
            max: 1,
            description: "Minimum score (0.0 to 1.0) required to unlock this card" 
        }
    }],

    // --- Information and Metadata ---
    summary: { 
        type: String, 
        trim: true 
    },
    metadata: {
        durationMin: { type: Number, default: 0 },
        difficulty: { 
            type: String, 
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        }
    },

    // --- AI Audit and Quality Control ---
    aiUsageCost: {
        inputTokens: { type: Number, default: 0 },
        outputTokens: { type: Number, default: 0 },
        costUsd: { type: Number, default: 0 }
    },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    // --- Logical Deletion Control ---
    deleted: { type: Boolean, default: false },    
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }

}, { 
    timestamps: true 
});

const Card = mongoose.model('Card', cardSchema);

export default Card;