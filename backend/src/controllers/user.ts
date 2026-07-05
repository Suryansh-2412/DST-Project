import type { Request, Response, NextFunction } from "express"
import { TryCatch } from "../middleware/error.js"
import { Doctor } from "../schema/doctor.js"
import { Patient } from "../schema/patient.js"

export const registerDoctor = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, password, license_no, specialty, address, fee, working_hrs } = req.body

        if (!name || !email || !password || !license_no) {
            res.status(400).json({ message: "Please provide all required fields" })
            return
        }

        const doctorExists = await Doctor.findOne({ email })
        if (doctorExists) {
            res.status(400).json({ message: "Doctor already exists with this email" })
            return
        }

        const doctor = await Doctor.create({
            name,
            email,
            password,
            license_no,
            specialty,
            address,
            fee,
            working_hrs
        })

        res.status(201).json({
            success: true,
            message: "Doctor registered successfully",
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email
            }
        })
    }
)

export const registerPatient = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, phone, password, dob, gender, bloodGroup, isVeg } = req.body

        if (!name || !phone || !password || !bloodGroup) {
            res.status(400).json({ message: "Please provide all required fields" })
            return
        }

        const patientExists = await Patient.findOne({ phone })
        if (patientExists) {
            res.status(400).json({ message: "Patient already exists with this phone number" })
            return
        }

        const patient = await Patient.create({
            name,
            phone,
            password,
            dob,
            gender,
            bloodGroup,
            isVeg
        })

        res.status(201).json({
            success: true,
            message: "Patient registered successfully",
            patient: {
                id: patient._id,
                name: patient.name,
                phone: patient.phone
            }
        })
    }
)
