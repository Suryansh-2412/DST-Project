import mongoose, { Document, Schema, Types } from 'mongoose'

export interface ISubscription extends Document {

    patient: Types.ObjectId,
    plan: Types.ObjectId,
    status: "active" | "inactive" | "cancelled" | "expired",
    startDate: Date | null,
    endDate: Date | null,
    autoRenew: boolean,
    paymentHistory: Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date,

    isCurrentlyActive: () => boolean

}

const subscriptionSchema = new mongoose.Schema(

    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
            unique: true
        },

        plan: {
            type: Schema.Types.ObjectId,
            ref: "Plan",
            required: true
        },

        status: {
            type: String,
            enum: ["active", "inactive", "cancelled", "expired"],
            default: "inactive"
        },

        startDate: {
            type: Date,
            default: null
        },

        endDate: {
            type: Date,
            default: null
        },

        autoRenew: {
            type: Boolean,
            default: false
        },

        paymentHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Payment"
            }
        ]

    },

    { timestamps: true }

)

// helper used by both the middleware and the status/features controllers
subscriptionSchema.methods.isCurrentlyActive = function (this: ISubscription) {
    return this.status === "active" && !!this.endDate && this.endDate.getTime() > Date.now()
}

export const Subscription = mongoose.model<ISubscription>("Subscription", subscriptionSchema)
