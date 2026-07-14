import type { Request, Response, NextFunction } from "express"
import { TryCatch } from "../middleware/error.js"
import type { AuthRequest } from "../middleware/auth.js"
import ErrorHandler from "../utils/utility-class.js"
import { razorpay } from "../config/razorpay.js"
import { verifyRazorpaySignature } from "../utils/paymentVerification.js"
import { Plan } from "../schema/plan.js"
import { Payment } from "../schema/payment.js"
import { Subscription } from "../schema/subscription.js"
import { Patient } from "../schema/patient.js"

// POST /payment/create-order
export const createOrder = TryCatch(async (req: Request, res: Response, next: NextFunction) => {

    const authReq = req as AuthRequest
    const { planId } = req.body

    if (authReq.user.role !== "patient") {
        return next(new ErrorHandler("Only patients can subscribe", 403))
    }

    if (!planId) {
        return next(new ErrorHandler("planId is required", 400))
    }

    const plan = await Plan.findById(planId)

    if (!plan || !plan.isActive) {
        return next(new ErrorHandler("Plan not found", 404))
    }

    // Razorpay expects amount in the smallest currency unit (paise for INR)
    const amountInPaise = Math.round(plan.price * 100)

    const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${String(authReq.user.id).slice(-10)}_${Date.now()}`,
        notes: {
            patientId: authReq.user.id,
            planId: String(plan._id)
        }
    })

    await Payment.create({
        patient: authReq.user.id,
        plan: plan._id,
        orderId: order.id,
        amount: plan.price,
        currency: "INR",
        status: "created"
    })

    res.status(200).json({
        success: true,
        orderId: order.id,
        amount: amountInPaise,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID
    })

})

// POST /payment/verify
export const verifyPayment = TryCatch(async (req: Request, res: Response, next: NextFunction) => {

    const authReq = req as AuthRequest
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return next(new ErrorHandler("Missing payment verification fields", 400))
    }

    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    const payment = await Payment.findOne({ orderId: razorpay_order_id })

    if (!payment) {
        return next(new ErrorHandler("Order not found", 404))
    }

    if (String(payment.patient) !== authReq.user.id) {
        return next(new ErrorHandler("Access denied", 403))
    }

    if (!isValid) {
        payment.status = "failed"
        await payment.save()
        return next(new ErrorHandler("Payment verification failed", 400))
    }

    const plan = await Plan.findById(payment.plan)

    if (!plan) {
        return next(new ErrorHandler("Plan no longer exists", 404))
    }

    payment.paymentId = razorpay_payment_id
    payment.signature = razorpay_signature
    payment.status = "paid"

    const now = new Date()
    const endDate = new Date(now.getTime() + plan.duration * 24 * 60 * 60 * 1000)

    // one subscription per patient — create it the first time, extend/replace after
    let subscription = await Subscription.findOne({ patient: authReq.user.id })

    if (subscription) {
        subscription.plan = plan._id as any
        subscription.status = "active"
        subscription.startDate = now
        subscription.endDate = endDate
        subscription.paymentHistory.push(payment._id as any)
    } else {
        subscription = new Subscription({
            patient: authReq.user.id,
            plan: plan._id,
            status: "active",
            startDate: now,
            endDate: endDate,
            paymentHistory: [payment._id]
        })
    }

    await subscription.save()

    payment.subscription = subscription._id as any
    await payment.save()

    await Patient.findByIdAndUpdate(authReq.user.id, { subscription: subscription._id })

    res.status(200).json({
        success: true,
        subscription: {
            plan: plan.name,
            status: subscription.status,
            expiresOn: subscription.endDate
        }
    })

})
