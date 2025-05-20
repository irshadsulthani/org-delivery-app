// src/infrastucture/cloudinary/cloudinaryProductUpload.ts
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { config } from '../../config';


cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudApiKey,
  api_secret: config.cloudApiSecret
});

// Update src/infrastucture/cloudinary/cloudinaryProductUpload.ts
export const uploadProductImageToCloudinary = async (file: Express.Multer.File): Promise<{url: string, publicId: string}> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { 
        public_id: `product_${Date.now()}`, 
        folder: 'product_images',
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed with no result'));
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );
    stream.end(file.buffer);
  });
};