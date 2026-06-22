import { Response } from 'express';
import { uploadFile } from '../services/s3';

export const handleDirectUpload = async (req: any, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const folder = req.body.folder || 'general';
        const fileUrl = await uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            folder
        );

        res.status(200).json({
            message: 'File uploaded successfully',
            url: fileUrl,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
