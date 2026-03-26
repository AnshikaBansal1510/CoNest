import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// 📸 Listing Photos Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'conest/listings',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
    ],
  },
});


// 👤 Avatar Storage
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'conest/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }
    ],
  },
});


// Upload middleware
const uploadListingPhotos = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array('photos', 8);

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single('avatar');


// ✅ Named exports
export { uploadListingPhotos, uploadAvatar, cloudinary };