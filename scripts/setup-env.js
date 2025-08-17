// Script to help set up environment variables
const envTemplate = `
# Cloudinary Configuration
# Sign up at https://cloudinary.com and get these values from your dashboard

# Required for image uploads (get from Cloudinary Console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret

# Public environment variables (prefix with NEXT_PUBLIC_)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=hope-autos-cars

# Instructions:
# 1. Create a Cloudinary account at https://cloudinary.com
# 2. Go to your Dashboard and copy the Cloud Name, API Key, and API Secret
# 3. Create an upload preset named 'hope-autos-cars' in your Cloudinary settings
#    - Go to Settings > Upload presets
#    - Click "Add upload preset"
#    - Set the preset name to: hope-autos-cars
#    - Set the folder to: hope-autos/cars
#    - Enable "Unsigned" signing mode
#    - Save the preset
# 4. Copy these values to your .env.local file
`

console.log("Cloudinary Environment Variables Template:")
console.log(envTemplate)
