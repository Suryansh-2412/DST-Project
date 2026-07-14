import express from 'express'
import { createOrder, verifyPayment } from '../controllers/payment.controller.js'
import { authMiddleware } from '../middleware/auth.js'

const paymentRoute = express.Router()

paymentRoute.post('/create-order', authMiddleware, createOrder)
paymentRoute.post('/verify', authMiddleware, verifyPayment)

export default paymentRoute
