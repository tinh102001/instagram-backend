import cloudinary from 'cloudinary';

const cloudinaryProvider = cloudinary.v2;

cloudinaryProvider.config({ 
    cloud_name: 'dtdb3rtw7', 
    api_key: '323282161395195', 
    api_secret: 'ay9HUBZv2klyqzByfVwdm-L_gMc' 
  });

export default cloudinaryProvider;