import express from 'express'
import { getStatus, getFeatures, getPlans } from '../controllers/subscription.controller.js'
import { authMiddleware } from '../middleware/auth.js'

const subscriptionRoute = express.Router()

subscriptionRoute.get('/plans', getPlans)
subscriptionRoute.get('/status', authMiddleware, getStatus)
subscriptionRoute.get('/features', authMiddleware, getFeatures)

export default subscriptionRoute
