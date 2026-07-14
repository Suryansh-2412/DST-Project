import Razorpay from 'razorpay'
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
})

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn("Razorpay keys are missing from .env — payment routes will fail until RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set.")
}

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string
})
