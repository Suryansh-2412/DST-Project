import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Patient from '../models/Patient';
import Doctor from '../models/Doctor';
import Admin from '../models/Admin';

const generateToken = (id: string, role: string) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || 'super_secret_key_nidaan_ai_platform_2026',
        { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
    );
};

export const registerPatient = async (req: Request, res: Response) => {
    try {
        const { name, password, phone, dob, gender, isVeg, bloodGroup, allergens, medicalHistory } = req.body;

        const patientExists = await Patient.findOne({ phone });
        if (patientExists) {
            return res.status(400).json({ message: 'Patient with this phone number already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const count = await Patient.countDocuments();
        const indexNo = count + 1;

        const patient = await Patient.create({
            name,
            password: hashedPassword,
            phone,
            indexNo,
            dob: dob ? new Date(dob) : undefined,
            gender,
            isVeg,
            bloodGroup,
            allergens: allergens || [],
            medicalHistory: medicalHistory || []
        });

        const token = generateToken(patient._id.toString(), 'patient');
        res.status(201).json({
            token,
            role: 'patient',
            user: {
                id: patient._id,
                name: patient.name,
                phone: patient.phone,
                indexNo: patient.indexNo,
                dob: patient.dob,
                age: patient.age,
                gender: patient.gender,
                isVeg: patient.isVeg,
                bloodGroup: patient.bloodGroup,
                allergens: patient.allergens,
                medicalHistory: patient.medicalHistory
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const registerDoctor = async (req: Request, res: Response) => {
    try {
        const { name, email, password, license_no, specialty, address, fee, working_hrs } = req.body;

        const doctorExists = await Doctor.findOne({ $or: [{ email }, { license_no }] });
        if (doctorExists) {
            return res.status(400).json({ message: 'Doctor with this email or license number already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const doctor = await Doctor.create({
            name,
            email,
            password: hashedPassword,
            license_no,
            specialty,
            address,
            fee,
            working_hrs
        });

        const token = generateToken(doctor._id.toString(), 'doctor');
        res.status(201).json({
            token,
            role: 'doctor',
            user: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                license_no: doctor.license_no,
                specialty: doctor.specialty,
                isVerified: doctor.isVerified,
                rating: doctor.rating
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword
        });

        const token = generateToken(admin._id.toString(), 'admin');
        res.status(201).json({
            token,
            role: 'admin',
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Please provide email/phone and password' });
        }

        let user: any = null;
        let role: 'patient' | 'doctor' | 'admin' = 'patient';

        const isEmail = identifier.includes('@');

        if (isEmail) {
            user = await Doctor.findOne({ email: identifier });
            if (user) {
                role = 'doctor';
            } else {
                user = await Admin.findOne({ email: identifier });
                if (user) {
                    role = 'admin';
                }
            }
        } else {
            user = await Patient.findOne({ phone: identifier });
            if (user) {
                role = 'patient';
            }
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id.toString(), role);

        const userData = { ...user.toObject() };
        delete userData.password;

        res.status(200).json({
            token,
            role,
            user: {
                id: user._id,
                name: user.name,
                ...userData
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let user: any = null;
        if (role === 'patient') {
            user = await Patient.findById(userId).populate('reports');
        } else if (role === 'doctor') {
            user = await Doctor.findById(userId);
        } else if (role === 'admin') {
            user = await Admin.findById(userId);
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = { ...user.toObject() };
        delete userData.password;

        res.status(200).json({
            role,
            user: {
                id: user._id,
                ...userData
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
