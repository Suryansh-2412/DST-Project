import type { Request, Response, NextFunction } from "express"
import { TryCatch } from "../middleware/error.js"
import { Doctor } from "../schema/doctor.js"
import { Appointment } from "../schema/appointment.js"
import type { AuthRequest } from "../middleware/auth.js"

import jwt from 'jsonwebtoken'

import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import { Patient } from "../schema/patient.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
})


const getPatients = TryCatch(async(req: AuthRequest, res: Response, next: NextFunction)=>{

    const token = req.cookies.token

    // check if token is null and role is doctor
    if (!token) {
        res.status(403).json({ message: "Access denied" })         
        return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: string,
            role: string
        }

    if (decoded.role !== 'doctor') {
        res.status(403).json({ message: "Access denied" })         
        return
    }    

    const doctor = await Doctor.findById(decoded.id)

    if(!doctor || !doctor._id){
        res.status(403).json({message: "Access Denied"})
        return        
    }

    let cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 18);

    // find the last appointment date for each unique patient
    const patientStatusList = await Appointment.aggregate([
        // filter by doctor
        { $match: { doctor: doctor._id } },
        
        // sort by date descending so newest appointment comes first
        { $sort: { date: -1 } },
        
        // group by patient ID
        {
            $group: {
                _id: "$patient",
                lastAppointmentDate: { $first: "$date" }
            }
        }
    ]);

    const patientId = patientStatusList.map(item => item.id)
    
    const patientData = await Patient.find(
        { id:{$in: patientId} }, 
        { name:1, phone:1, age:1, bloodGroup:1, isVeg:1 }
    ) 

        const appointmentMap = new Map(
        patientStatusList.map(item => [item._id.toString(), item.lastAppointmentDate])
    );

    const formattedPatients = patientData.map(patient => {
        const lastApptDate = appointmentMap.get(patient._id.toString());
        
        return {
            _id: patient._id,
            name: patient.name,
            phone: patient.phone,
            bloodGroup: patient.bloodGroup,
            age: patient.age,
            isVeg: patient.isVeg,
            lastAppointment: lastApptDate,
            status: lastApptDate && lastApptDate >= cutoffDate ? "Active" : "Inactive"
        };
    });

    res.status(200).json({
        success: true,
        count: formattedPatients.length,
        patients: formattedPatients
    });
});

export default getPatients