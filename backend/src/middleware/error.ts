import { type Response, type Request,type NextFunction } from 'express'
import type ErrorHandler from '../utils/utility-class.js'
import type { ControllerType } from '../types/types.js'

export const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction)=>{

    err.message ||= "Some Error Occurred"
    err.statusCode ||=500

    console.error("Backend Error:", err);

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })

}

export const TryCatch = (func: ControllerType) => (req: Request, res: Response, next: NextFunction) => { 
    return Promise.resolve(func(req, res, next)).catch(next)
}