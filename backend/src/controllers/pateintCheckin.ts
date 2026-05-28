
// type imports
import type {Request, Response, NextFunction} from 'express'

// try catch and schema imports
import { TryCatch } from '../middleware/error.js'
import { Patient } from '../schema/patient.js'

// schema import
import { checkIn } from '../schema/checkiIn.js'

// jwt import
import jwt from 'jsonwebtoken'

// path and dot env import
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import type { AuthRequest } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
})

interface checkinBody {
    vibes: number;
    painLevel: number;
    notes?: string;
}

const checkInFunction = TryCatch(async(req: AuthRequest<checkinBody>, res: Response, next: NextFunction) => {

    // get and verify token
    const token = req.cookies.token
    
    // check if token is null and role is patient
    if (!token) {
        res.status(403).json({ message: "Access denied" })         
        return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: string,
            role: string
        }

    if (decoded.role !== 'patient') {
        res.status(403).json({ message: "Access denied" })         
        return
    }    

    // get patient details
    const patient = await Patient.findById(decoded.id)

    // check patient exists
    if(!patient || !patient._id){
        res.status(403).json({message: "Access Denied"})
        return 
    }

    const {vibes, painLevel, notes} = req.body


    const newEntry = await checkIn.create(
        {
            patient: patient._id,
            vibes: vibes,
            painLevel: painLevel,
            notes: notes ?? ""
        }
    )

    const count = await checkIn.countDocuments({patient: patient._id})

    if(count > 10){
    
        const recentEntries = await checkIn.find({patient: patient._id}, { _id: 1 })
        .sort({ createdAt: -1 }) // sort newest to oldest
        .limit(10);              // keep only the top 10

        // Extract just the IDs into an array
        const recentIds = recentEntries.map(doc => doc._id);

        // 2. Delete everything else that is NOT in those 10 IDs
        const deleteResult = await checkIn.deleteMany({patient: patient._id,
          _id: { $nin: recentIds }
        });
    
    }

    res.status(201).json({message: "Successfully logged in entry"})

})

export default checkInFunction