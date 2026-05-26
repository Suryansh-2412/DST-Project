import express from "express"

import doctorDashboard from "../controllers/doctorDashboard.js"
import patientDashboard from "../controllers/patientDashboard.js"

const router = express.Router()

// patient
router.get("/patient",patientDashboard) 

// doctor
router.get("/doctor", doctorDashboard)



export default router