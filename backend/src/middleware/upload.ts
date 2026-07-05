import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|tiff/;
        const mimeType = allowedTypes.test(file.mimetype);
        
        if (mimeType) {
            return cb(null, true);
        }
        cb(new Error('Invalid file type. Only JPG, PNG, GIF, PDF, and TIFF are allowed.') as any);
    }
});
