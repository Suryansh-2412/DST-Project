import { Response } from 'express';
import Doctor from '../models/Doctor';
import Patient from '../models/Patient';
import Record from '../models/Record';
import Appointment from '../models/Appointment';
import { uploadFile } from '../services/s3';

export const getMyPatients = async (req: any, res: Response) => {
    try {
        const doctor = await Doctor.findById(req.user.id).populate('patients');
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor.patients);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const addPatientToDoctor = async (req: any, res: Response) => {
    try {
        const { patientId } = req.body;
        
        const doctor = await Doctor.findById(req.user.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        if (!doctor.patients.includes(patient._id as any)) {
            doctor.patients.push(patient._id as any);
            await doctor.save();
        }

        res.status(200).json({ message: 'Patient successfully added under your care', patient });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getPatientDetails = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id).populate('reports');
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadPatientRecord = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { title, type, summary } = req.body;
        
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file report' });
        }

        const fileUrl = await uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            `patient-${id}`
        );

        const doctor = await Doctor.findById(req.user.id);
        const doctorName = doctor ? doctor.name : 'Attending Doctor';

        const record = await Record.create({
            title: title || req.file.originalname,
            type: type || 'Scan',
            summary: summary || '',
            doctorName,
            fileUrl,
            patient: patient._id
        });

        patient.reports.push(record._id as any);
        await patient.save();

        res.status(201).json({ message: 'Medical record uploaded successfully', record });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePatientNotes = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { notes, medicalHistory, allergens } = req.body;

        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const updateObj: any = {};
        if (notes !== undefined) updateObj.notes = notes;
        if (medicalHistory !== undefined) updateObj.medicalHistory = medicalHistory;
        if (allergens !== undefined) updateObj.allergens = allergens;

        const updatedPatient = await Patient.findByIdAndUpdate(
            id,
            { $set: updateObj },
            { new: true }
        );

        res.status(200).json({ message: 'Patient notes updated successfully', patient: updatedPatient });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getDoctorAppointments = async (req: any, res: Response) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user.id })
            .populate('patient', 'name phone dob age gender indexNo bloodGroup')
            .sort({ date: 1 });
        res.status(200).json(appointments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createAppointment = async (req: any, res: Response) => {
    try {
        const { patientId, date, notes } = req.body;

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const appointment = await Appointment.create({
            doctor: req.user.id,
            patient: patientId,
            date: new Date(date),
            notes
        });

        res.status(201).json(appointment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDoctorProfile = async (req: any, res: Response) => {
    try {
        const { name, specialty, address, fee, working_hrs } = req.body;
        
        const doctor = await Doctor.findById(req.user.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (name) doctor.name = name;
        if (specialty) doctor.specialty = specialty;
        if (address) doctor.address = address;
        if (fee !== undefined) doctor.fee = fee;
        if (working_hrs) {
            if (working_hrs.start) doctor.working_hrs.start = working_hrs.start;
            if (working_hrs.end) doctor.working_hrs.end = working_hrs.end;
        }

        await doctor.save();
        res.status(200).json({ message: 'Profile updated successfully', doctor });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
