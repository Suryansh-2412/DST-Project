import express from "express"

import patientDashboard from "../controllers/patientDashboard.js"
import checkInFunction from "../controllers/pateintCheckin.js"

import doctorDashboard from "../controllers/doctorDashboard.js"
import getPatients from "../controllers/doctorPatients.js"

import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

// patient
router.get("/patient/",patientDashboard) 
router.get("/patient/records", authMiddleware,fetchRecords)
router.post("/patient/checkin", authMiddleware, checkInFunction)
router.post("/patient/settings", authMiddleware, updatePatientProfile)
router.post("/patient/chat", authMiddleware, chatWithBot)

// doctor
router.get("/doctor/", doctorDashboard)
router.get("/doctor/patients", authMiddleware,getPatients)
router.get("/doctor/monitoring", authMiddleware, monitorDetails)
router.post("/doctor/settings", authMiddleware, updateProfile)
router.post("/doctor/addPatient", authMiddleware, addPatient)

// admin
router.get("/admin/", authMiddleware, adminDashboard)
router.get("/admin/models", authMiddleware, getModelDetails)
router.post("/admin/verify", authMiddleware, verifyDoctor)

export default router