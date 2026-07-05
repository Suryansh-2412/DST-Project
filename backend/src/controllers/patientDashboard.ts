
// type imports
import type {Request, Response, NextFunction} from 'express'
import type { AuthRequest } from '../middleware/auth.js'

// try catch and schema imports
import { TryCatch } from '../middleware/error.js'
import { Patient } from '../schema/patient.js'

// jwt import
import jwt from 'jsonwebtoken'
// how the fuck did I not have time to code today
// path and dot env import
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import { Appointment } from '../schema/appointment.js'
import { Doctor } from '../schema/doctor.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
})

const patientDashboard = TryCatch(async (req: Request, res: Response, next: NextFunction) => {

    // get and verify token
    const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: string,
            role: string
        }

    // decode jwt and cast as user{id, role}
    let authReq = req as AuthRequest
    authReq.user = decoded    
    
    // check if token is null and role is patient
    if (!token || authReq.user.role !== 'patient') {
        res.status(403).json({ message: "Access denied" })         
        return
    }

    // get patient details
    const patient = await Patient.findById(authReq.user.id)

    // check patient exists
    if(!patient || !patient._id){
        res.status(403).json({message: "Access Denied"})
        return 
    }

    // get next nearest appointment and doctor details to show
    const nextAppt = await Appointment.find({patient: patient._id, date: {$gte : new Date()}})
                                      .sort({date: 1})
                                      .limit(1)

    // nextAppt returns array so get first element
    const appt = nextAppt[0]

    // get recent reports
    const reports = patient.reports?.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5) || "No rpeorts uploaded"
    
    if(!appt){

        res.json({
        
            name: patient?.name,
            id: patient?.indexNo,
        
            nextAppointment: "no upcoming appointments",
        
            reports: reports

        })
        return 
    }

    const doctor = await Doctor.findById(appt.doctor)
    let name = doctor?.name || "No name"
    let title = doctor?.specialty || "general doctor" 
    let date = appt.date
    
    // return patient name, id, next nearest appointment and recent reports
    res.json({
        
        name: patient?.name,
        id: patient?.indexNo,
        
        nextAppointment: {
            date: date,
            doctorName: name,
            doctorSpecialty: title,
        },
        
        reports: reports

    })

})

export default patientDashboard