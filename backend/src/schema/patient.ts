import mongoose, { Document } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'

export interface IPatient extends Document{

    name: string,
    password: string,
    indexNo: number,
    phone: string,
    dob: Date,
    age: number,
    bloodGroup: string,
    isVeg: boolean,
    appointmentHistory: [],
    medicalHistory: [],
    allergens:[],
    reports: [{
        tile: string,
        fileUrl: string,
        createdAt: Date
    }],
    gender: "male" | "female" | "other",
    subscription: mongoose.Types.ObjectId | null,
    createdAt: Date,
    updatedAt: Date,
    
}

const patientSchema = new mongoose.Schema(

    {
        name: {
            type: String,
            required: true,
            default: "Name"
        },

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: [true, 'please enter phone number'],
            unique: true,
            validate: validator.default.isMobilePhone
        },

        indexNo: {
            type: Number,
            required: true,
            default: 1
        },

        dob: {
            type: Date,
            required: true,
            default: Date.now
        },

        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'other'],
            default: "male"
        },

        isVeg: {
            type: Boolean,
            required: true,
            default: true
        },
        
        bloodGroup: {
            type: String,
            required: true,
        },

        allergens: {
            type: [String],
            default: []
        },

        medicalHistory: {
            type: [String],
            default: []           
        },

        appointmentHistory: {
            type: [String],
            default: []
        },

        reports: [
            {
                title: String,
                fileUrl: String,
                createdAt: Date
            }
        ],

        subscription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription",
            default: null
        }

    },
    {timestamps: true}

)

patientSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10)
})

patientSchema.virtual("age").get( function() {

    const today = new Date()
    const dob = this.dob

    let age = today.getFullYear() - dob.getFullYear()
    if(today.getMonth() < dob.getMonth()) age--
    
    return age
    
})


export const Patient = mongoose.model<IPatient>("Patient", patientSchema)