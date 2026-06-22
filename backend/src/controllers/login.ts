import type { Request, Response, NextFunction } from "express"
import { TryCatch } from "../middleware/error.js"
import { Doctor, type IDoctor } from "../schema/doctor.js"
import { Patient, type IPatient } from "../schema/patient.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
})

export const login = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id, password, role } = req.body

        if (role === "admin") {
            if (id === "admin@gmail.com" && password === "admin123") {
                const token = jwt.sign(
                    { id: "admin_id", role: "admin" },
                    process.env.JWT_SECRET as string,
                    { expiresIn: "1d" }
                )

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: false, // for local testing
                    sameSite: "lax",
                    maxAge: 1 * 24 * 60 * 60 * 1000
                })

                res.status(200).json({
                    success: true,
                    role: "admin"
                })
                return
            } else {
                res.status(400).json({ message: "Invalid Admin Credentials" })
                return
            }
        }

        let user: IDoctor | IPatient | null = null
        let isDoctor = role === "doctor"

        if (isDoctor) {
            user = await Doctor.findOne({ email: id })
        } else if (role === "patient") {
            user = await Patient.findOne({ phone: id })
        } else {
            res.status(400).json({ message: "Invalid Role" })
            return
        }

        if (!user) {
            res.status(400).json({ message: "User not found" })
            return
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" })
            return
        }

        const token = jwt.sign(
            { id: user._id, role: role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // for local testing
            sameSite: "lax",
            maxAge: 1 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            success: true,
            role: role 
        })
        return
    }
)