import express from 'express'
import { login } from '../controllers/login.js'

const loginRoute = express.Router()

loginRoute.post('/login', login)

export default loginRoute