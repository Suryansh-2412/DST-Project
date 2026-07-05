import { Request, Response } from 'express';
import { runAIDiagnostics } from '../services/ai';

export const analyzeCondition = async (req: Request, res: Response) => {
    try {
        const { condition } = req.body;
        if (!condition) {
            return res.status(400).json({ message: 'Please provide condition to analyze' });
        }

        const analysis = await runAIDiagnostics(condition);
        res.status(200).json(analysis);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
