import mongoose, {Document, Schema, Types} from 'mongoose'

interface IAppt extends Document{

    doctor: Types.ObjectId,
    patient: Types.ObjectId,
    date: Date,
    createdAt: Date,
    updatedAt: Date,
    notes: string,
    hasOccurred: boolean

}

const apptSchema = new mongoose.Schema(
    
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

        date: {
            type: Date,
            required: true
        },

        notes: {
            type: String,
            required: false
        }

    },

    {timestamps: true}
)

apptSchema.virtual("hasOccurred").get(function(){

    const today = new Date()
    const apptDate = this.date

    if(apptDate < new Date()) return true

    return false

})

export const Appointment = mongoose.model<IAppt>("Appointment", apptSchema)