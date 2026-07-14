import type { Request, Response, NextFunction } from "express"
import { TryCatch } from "./error.js"
import type { AuthRequest } from "./auth.js"
import { Subscription } from "../schema/subscription.js"

// Runs AFTER authMiddleware. Any route that needs an active subscription
// (chatbot today, smartwatch/IoT later, premium reports down the line)
// just adds this middleware — no payment code has to change per-feature.
export const requireSubscription = TryCatch(async (req: Request, res: Response, next: NextFunction) => {

    const authReq = req as AuthRequest

    if (!authReq.user || authReq.user.role !== "patient") {
        res.status(403).json({ message: "Access denied" })
        return
    }

    const subscription = await Subscription.findOne({ patient: authReq.user.id })

    const isActive = !!subscription && subscription.status === "active" && !!subscription.endDate && subscription.endDate.getTime() > Date.now()

    if (!isActive) {
        res.status(403).json({ message: "Active subscription required" })
        return
    }

    return next()

})
