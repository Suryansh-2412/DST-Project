import mongoose ,{Document, Schema, Types} from "mongoose"

interface IcheckIn extends Document{

    patient: Types.ObjectId,
    vibes: number,
    painLevel: number,
    notes: string,
    createdAt: Date,
    updatedAt: Date

}

const checkInSchema = new mongoose.Schema({

    patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true
    },
    
    vibes: {
        type: Number,
        required: true,
        default: 0
    },

    painLevel: {
        type: Number,
        required: true,
        default: 0
    },

    notes:{
        type: String,
        required: false,
    },
    },
    {timestamps: true}
)


export const checkIn = mongoose.model<IcheckIn>("checkIn", checkInSchema)