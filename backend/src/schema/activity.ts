import mongoose, { Document, Schema, Types } from 'mongoose'

interface IActivity extends Document {
    doctor: Types.ObjectId,
    patient: Types.ObjectId,
    type: 'alert' | 'appointment' | 'analysis',
    title: string,
    description: string,
    createdAt: Date
}

const activitySchema = new mongoose.Schema(
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
            enum: ['alert', 'appointment', 'analysis'],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

export const Activity = mongoose.model<IActivity>("Activity", activitySchema)