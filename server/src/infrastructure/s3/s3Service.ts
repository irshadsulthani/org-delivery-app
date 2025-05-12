// src/infrastructure/services/s3Service.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../../config';

const s3 = new S3Client({
  region: config.awsRegion!, // Add `!` if you're sure it's defined
  credentials: {
    accessKeyId: config.awsAccessKeyId!,
    secretAccessKey: config.awsSecretAccessKey!,
  },
});


export const uploadToS3 = async (fileBuffer: Buffer, filename: string): Promise<string> => {
  const params = {
    Bucket: config.awsBucket || '',
    Key: `verification_images/${filename}`,
    Body: fileBuffer,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  // Construct the URL manually (v3 doesn't return Location directly)
  return `https://${config.awsBucket}.s3.${config.awsRegion}.amazonaws.com/verification_images/${filename}`;
};
