import { Response } from 'express';
import Doctor from '../models/Doctor';
import Patient from '../models/Patient';

let aiModels = [
    { id: 'leukemia-det', name: 'Leukemia Micro-Detection', category: 'Haematology', accuracy: '98.4%', status: 'Active', version: 'v2.4.1', load: '12%' },
    { id: 'malaria-cell', name: 'Malaria Parasite Classifier', category: 'Parasitology', accuracy: '96.2%', status: 'Active', version: 'v1.8.0', load: '8%' },
    { id: 'pneumonia-xray', name: 'Pneumonia Chest X-Ray Analyzer', category: 'Radiology', accuracy: '94.8%', status: 'Active', version: 'v3.1.2', load: '15%' }
];

export const getPendingDoctors = async (req: any, res: Response) => {
    try {
        const pendingDoctors = await Doctor.find({ isVerified: false }).select('-password');
        res.status(200).json(pendingDoctors);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyDoctor = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        doctor.isVerified = true;
        await doctor.save();

        res.status(200).json({ message: `Doctor ${doctor.name} verified successfully`, doctor });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const rejectDoctor = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        await Doctor.findByIdAndDelete(id);
        res.status(200).json({ message: `Doctor account rejected and removed` });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAIModels = async (req: any, res: Response) => {
    try {
        res.status(200).json(aiModels);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleAIModelStatus = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const model = aiModels.find(m => m.id === id);
        if (!model) {
            return res.status(404).json({ message: 'AI model not found' });
        }

        if (status) {
            model.status = status;
        } else {
            model.status = model.status === 'Active' ? 'Maintenance' : 'Active';
        }

        res.status(200).json({ message: `AI model status updated successfully`, model, allModels: aiModels });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
