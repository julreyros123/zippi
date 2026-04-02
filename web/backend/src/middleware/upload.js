const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zippi_uploads', // Folder name in Cloudinary
    resource_type: 'auto', // Automatically detect if logic is image, video, or raw (raw for pdfs, zips, etc)
    public_id: (req, file) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      return `${Date.now()}-${name}`;
    }
  }
});

const upload = multer({ storage });
module.exports = upload;
