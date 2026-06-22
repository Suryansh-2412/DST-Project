import { Response } from 'express';
import Patient from '../models/Patient';
import CheckIn from '../models/CheckIn';
import Record from '../models/Record';
import Appointment from '../models/Appointment';

export const getProfile = async (req: any, res: Response) => {
    try {
        const patient = await Patient.findById(req.user.id).populate('reports');
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req: any, res: Response) => {
    try {
        const { dob, isVeg, bloodGroup, allergens, medicalHistory, phone, name } = req.body;
        
        const patient = await Patient.findById(req.user.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        if (dob) patient.dob = new Date(dob);
        if (isVeg !== undefined) patient.isVeg = isVeg;
        if (bloodGroup) patient.bloodGroup = bloodGroup;
        if (allergens) patient.allergens = allergens;
        if (medicalHistory) patient.medicalHistory = medicalHistory;
        if (phone) patient.phone = phone;
        if (name) patient.name = name;

        await patient.save();
        res.status(200).json(patient);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCheckIn = async (req: any, res: Response) => {
    try {
        const { mood, painLevel, notes } = req.body;
        
        const checkIn = await CheckIn.create({
            patient: req.user.id,
            mood,
            painLevel,
            notes
        });

        res.status(201).json(checkIn);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getCheckIns = async (req: any, res: Response) => {
    try {
        const checkIns = await CheckIn.find({ patient: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(checkIns);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getRecords = async (req: any, res: Response) => {
    try {
        const records = await Record.find({ patient: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(records);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAppointments = async (req: any, res: Response) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id })
            .populate('doctor', 'name email specialty address fee rating')
            .sort({ date: 1 });
        res.status(200).json(appointments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
