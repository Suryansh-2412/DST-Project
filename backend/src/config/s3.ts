import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const hasS3Credentials = 
    process.env.AWS_ACCESS_KEY_ID && 
    process.env.AWS_SECRET_ACCESS_KEY && 
    process.env.AWS_BUCKET_NAME;

export const s3Client = hasS3Credentials 
    ? new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        }
      })
    : null;

if (!s3Client) {
    console.warn("AWS S3 credentials not fully provided. Falling back to local disk storage for uploaded reports.");
}
