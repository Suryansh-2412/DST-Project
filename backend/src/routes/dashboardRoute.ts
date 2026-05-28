import express from "express"

import patientDashboard from "../controllers/patientDashboard.js"
import checkInFunction from "../controllers/pateintCheckin.js"

import doctorDashboard from "../controllers/doctorDashboard.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

// patient
router.get("/patient/",patientDashboard) 
router.get("/patient/records", authMiddleware,fetchRecords)
router.post("/patient/checkin", authMiddleware, checkInFunction)
router.post("/patient/settings", updatePatientProfile)
router.post("/patient/chat", chatWithBot)

// doctor
router.get("/doctor/", doctorDashboard)
router.get("/doctor/patients", getPatients)
router.get("/doctor/monitoring", monitorDetails)
router.post("/doctor/settings", updateProfile)
router.post("/doctor/addPatient", addPatient)

// admin
router.get("/admin/", adminDashboard)
router.post("/admin/verify", verifyDoctor)
router.get("/admin/models", getModelDetails)

export default router