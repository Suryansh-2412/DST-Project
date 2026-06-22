import express from "express"

import doctorDashboard from "../controllers/doctorDashboard.js"
import patientDashboard from "../controllers/patientDashboard.js"

const router = express.Router()

// patient
router.get("/patient",patientDashboard) 
    //authMiddleware, async (req: Request, res) => {

//     if (req.user.role !== "patient") {
//         return res.status(403).json({ message: "Access denied" })
//     }

//     const patient = await Patient.findById(req.user.id)

//     if(!patient){
//         return res.status(403).json({ message: "Access denied" })
//     }

//     res.json(patient)
// })

// doctor
router.get("/doctor", doctorDashboard)

export default router