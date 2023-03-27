import cloudinary from 'cloudinary';

const cloudinaryProvider = cloudinary.v2;

cloudinaryProvider.config({ 
    cloud_name: 'dnfwvyqim', 
    api_key: '859993296383842', 
    api_secret: 'Wm6jTpCtiOuVUncssJQaW0lGyAk' 
  });

export default cloudinaryProvider;