import express from 'express'
import { registerDoctor, registerPatient } from '../controllers/user.js'

const userRoute = express.Router()

userRoute.post('/register/doctor', registerDoctor)
userRoute.post('/register/patient', registerPatient)

export default userRoute
