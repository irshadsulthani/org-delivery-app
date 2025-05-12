import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { config } from '../../config';


cloudinary.config({
  cloud_name: config.cloudName ,
  api_key: config.cloudApiKey,
  api_secret: config.cloudApiSecret
});

export const uploadToCloudinary = async (fileBuffer: Buffer, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: filename, folder: 'profile_images' },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed with no result'));
        resolve(result.secure_url);
      }
    );
    Readable.from(fileBuffer).pipe(stream);
  });
};
