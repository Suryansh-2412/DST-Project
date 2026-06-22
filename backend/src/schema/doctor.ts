import mongoose, { Schema, Types, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IDoctor extends Document{

    name: string,
    email: string,
    password: string,
    license_no: string,
    specialty: string,
    address: string,
    fee: number,
    working_hrs: {
        start: string
        end: string
    },
    patients: Types.ObjectId[],
    isVerified: boolean,
    createdAt: Date,
    updatedAt: Date,
    rating: number
}

const doctorSchema = new mongoose.Schema(

    {
        name: {
            type: String, 
            required: true,
            default: "Name"
        },

        email:{
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true,
        },

        license_no: {
            type: String,
            required: true,
            unique: true,
        },

        specialty: {
            type: String,
            required: true,
            default: "General surgeon"
        },

        address: {
            type: String,
            required: true,
            default: "Address"
        },

        fee: {
            type: Number,
            required: true,
            default: 500.00
        },

        working_hrs: {
            start: {
                type: String,
                required: true,
                default: "10:00"
            },
            end: {
                type: String,
                required: true,
                default: "5:00"
            }
        },

        patients: [{
            type: Schema.Types.ObjectId,
            ref: 'Patient'
        }],

        isVerified: {
            type: Boolean,
            default: false
        },

        rating: {
            type: Number
        }

    },

    {
        timestamps: true
    }

)

doctorSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10)
})

export const Doctor = mongoose.model<IDoctor>("Doctor", doctorSchema)