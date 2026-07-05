import mongoose from 'mongoose'

export const connectDB = ()=>{
    mongoose.connect("mongodb://localhost:27017/", {
        dbName: "DST-Project"
    }).then(c=>console.log("DB Connected")).catch(e=> console.log(e))
}