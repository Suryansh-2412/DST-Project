import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        mongoose.connect("mongodb://localhost:27017/", {
        dbName: "DST-Project"
    }).then(c=>console.log("DB Connected")).catch(e=> console.log(e))
    } catch (error: any) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};
