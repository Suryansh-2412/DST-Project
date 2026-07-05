import mongoose, { Document, Schema, Types } from 'mongoose'

interface IAnalysis extends Document {
    doctor: Types.ObjectId,
    patient: Types.ObjectId,
    type: string, // e.g., 'diagnosis', 'prediction'
    result: string,
    confidence: number, // e.g., 0.95 for 95%
    notes: string,
    createdAt: Date,
    updatedAt: Date
}

const analysisSchema = new mongoose.Schema(
    {
        doctor: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },
        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        type: {
            type: String,
            required: true
        },
        result: {
            type: String,
            required: true
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1,
            required: true
        },
        notes: {
            type: String,
            required: false
        }
    },
    { timestamps: true }
)

export const Analysis = mongoose.model<IAnalysis>("Analysis", analysisSchema)