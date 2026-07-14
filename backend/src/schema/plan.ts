import mongoose, { Document } from 'mongoose'

export interface IPlan extends Document {

    name: string,
    price: number,          // in INR (rupees, not paise)
    duration: number,       // in days
    features: {
        chatbot: boolean,
        iot: boolean
    },
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date

}

const planSchema = new mongoose.Schema(

    {
        name: {
            type: String,
            required: true,
            unique: true
        },

        price: {
            type: Number,
            required: true,
            default: 0
        },

        duration: {
            type: Number,
            required: true,
            default: 30
        },

        features: {
            chatbot: {
                type: Boolean,
                default: false
            },
            iot: {
                type: Boolean,
                default: false
            }
        },

        isActive: {
            type: Boolean,
            default: true
        }

    },

    { timestamps: true }

)

export const Plan = mongoose.model<IPlan>("Plan", planSchema)
