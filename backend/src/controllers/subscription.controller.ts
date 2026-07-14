import type { Request, Response, NextFunction } from "express"
import { TryCatch } from "../middleware/error.js"
import type { AuthRequest } from "../middleware/auth.js"
import { Subscription } from "../schema/subscription.js"
import { Plan } from "../schema/plan.js"

// GET /subscription/plans (public — used to render pricing before the user is subscribed)
export const getPlans = TryCatch(async (req: Request, res: Response, next: NextFunction) => {

    const plans = await Plan.find({ isActive: true }).select("name price duration features")

    res.status(200).json({ plans })

})

// GET /subscription/status
export const getStatus = TryCatch(async (req: Request, res: Response, next: NextFunction) => {

    const authReq = req as AuthRequest

    const subscription = await Subscription.findOne({ patient: authReq.user.id }).populate("plan")

    const isActive = !!subscription && subscription.status === "active" && !!subscription.endDate && subscription.endDate.getTime() > Date.now()

    if (!isActive || !subscription) {
        res.status(200).json({ active: false, plan: null, expiresOn: null })
        return
    }

    const plan = subscription.plan as any

    res.status(200).json({
        active: true,
        plan: plan?.name || null,
        expiresOn: subscription.endDate
    })

})

// GET /subscription/features
export const getFeatures = TryCatch(async (req: Request, res: Response, next: NextFunction) => {

    const authReq = req as AuthRequest

    const subscription = await Subscription.findOne({ patient: authReq.user.id }).populate("plan")

    const isActive = !!subscription && subscription.status === "active" && !!subscription.endDate && subscription.endDate.getTime() > Date.now()

    if (!isActive || !subscription) {
        res.status(200).json({ chatbot: false, iot: false })
        return
    }

    const plan = subscription.plan as any

    res.status(200).json({
        chatbot: !!plan?.features?.chatbot,
        iot: !!plan?.features?.iot
    })

})
