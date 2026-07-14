import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IPayment extends Document {

    patient: Types.ObjectId,
    subscription: Types.ObjectId | null,
    plan: Types.ObjectId,
    orderId: string,
    paymentId: string | null,
    signature: string | null,
    amount: number,
    currency: string,
    status: "created" | "paid" | "failed",
    createdAt: Date,
    updatedAt: Date

}

const paymentSchema = new mongoose.Schema(

    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },

        subscription: {
            type: Schema.Types.ObjectId,
            ref: "Subscription",
            default: null
        },

        plan: {
            type: Schema.Types.ObjectId,
            ref: "Plan",
            required: true
        },

        orderId: {
            type: String,
            required: true,
            unique: true
        },

        paymentId: {
            type: String,
            default: null
        },

        signature: {
            type: String,
            default: null
        },

        amount: {
            type: Number,
            required: true
        },

        currency: {
            type: String,
            required: true,
            default: "INR"
        },

        status: {
            type: String,
            enum: ["created", "paid", "failed"],
            default: "created"
        }

    },

    { timestamps: true }

)

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema)
