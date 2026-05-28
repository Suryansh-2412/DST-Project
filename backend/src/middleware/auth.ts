import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import { TryCatch } from "./error.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
})

export interface AuthRequest<B = any> extends Request<{}, {}, B> {
    user?: {
        id: string,
        role: string
    }
}

export const authMiddleware = TryCatch(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token

    if (!token) {
        res.status(401).json({ message: "Not authenticated" })
        return
    }
    
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
    ) as { id: string; role: string }

    req.user = decoded
    return next()

})