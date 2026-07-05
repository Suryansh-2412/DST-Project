import type { Request, Response, NextFunction } from "express"
import { TryCatch } from "../middleware/error.js"
import { Doctor } from "../schema/doctor.js"
import { Appointment } from "../schema/appointment.js"
import { Activity } from "../schema/activity.js"
import { Analysis } from "../schema/analysis.js"
import type { AuthRequest } from "../middleware/auth.js"

import jwt from 'jsonwebtoken'

import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
})

const doctorDashboard = TryCatch(async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string,
        role: string
    }

    let authReq = req as AuthRequest
    authReq.user = decoded    

    if (!token) {
        res.status(403).json({ message: "Access denied" })         
        return
    }

    const doctor = await Doctor.findById(authReq.user.id)

    if(!doctor){
        res.status(403).json({ message: "Access denied" })
        return
    }

    // Fetch stats
    const totalPatients = doctor.patients? doctor.patients.length : 0
    const activeCases = await Appointment.countDocuments({ doctor: doctor._id, date: { $gt: new Date() } })
    const aiAnalyses = await Analysis.countDocuments({ doctor: doctor._id })

    // Fetch activity 
    let activityFeed = await Activity.find({ doctor: doctor._id }).sort({ createdAt: -1 }).limit(10).lean()
    if(!activityFeed || activityFeed.length == 0){
        activityFeed = []
    }

    // const alerts = await Alert.find({ doctor: doctor._id, priority: { $in: ['critical', 'high'] }, resolved: false }).sort({ createdAt: -1 }).limit(5).lean()

    res.json({

        // full schema entry
        doctor: doctor,

        // stat card entries
        stats: {
            totalPatients,
            // active cases not needed nut for safety //activeCases,
            //criticalAlerts,
            aiAnalyses
        },

        // recent activity
        activityFeed: activityFeed.map(item => ({
            id: item._id,
            title: item.title,
            description: item.description,
            time: item.createdAt.toISOString(), // Or format as relative time if needed
            type: item.type
        })),
        // alerts: alerts.map(alert => ({
        //     id: alert._id,
        //     title: alert.title,
        //     description: alert.description,
        //     patientId: alert.patient,
        //     priority: alert.priority
        // }))
    })
}
)
    
export default doctorDashboard