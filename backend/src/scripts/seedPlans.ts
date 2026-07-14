import mongoose from 'mongoose'
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import { Plan } from '../schema/plan.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
})

const plans = [
    {
        name: "Free",
        price: 0,
        duration: 36500, // effectively unlimited
        features: { chatbot: false, iot: false }
    },
    {
        name: "Premium Monthly",
        price: 299,
        duration: 30,
        features: { chatbot: true, iot: true }
    }
]

const run = async () => {

    await mongoose.connect("mongodb://localhost:27017/", { dbName: "DST-Project" })

    for (const plan of plans) {
        await Plan.findOneAndUpdate(
            { name: plan.name },
            plan,
            { upsert: true, new: true }
        )
        console.log(`Seeded plan: ${plan.name}`)
    }

    await mongoose.disconnect()

}

run().catch((err) => {
    console.error(err)
    process.exit(1)
})
