# Cloudinary Image Upload Setup Guide

This guide will help you set up Cloudinary for car photo uploads in the Hope Autos admin panel.

## 1. Create Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com) and sign up for a free account
2. After registration, you'll be taken to your Dashboard

## 2. Get Your Credentials

From your Cloudinary Dashboard, copy these values:
- **Cloud Name** (e.g., `your-cloud-name`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## 3. Create Upload Preset

1. In your Cloudinary console, go to **Settings** > **Upload presets**
2. Click **"Add upload preset"**
3. Configure the preset:
   - **Preset name**: `hope-autos-cars`
   - **Signing Mode**: Select `Unsigned`
   - **Folder**: `hope-autos/cars`
   - **Allowed formats**: `jpg,jpeg,png,webp`
   - **Max file size**: `10000000` (10MB)
   - **Max image dimensions**: `2000x2000`
   - **Auto tagging**: `auto` (optional)
4. Click **Save**

## 4. Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Public Environment Variables
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=hope-autos-cars
\`\`\`

## 5. Features

### Image Upload
- **Multiple uploads**: Upload up to 8 images per car
- **Drag & drop reordering**: Rearrange images by dragging
- **Auto-optimization**: Images are automatically optimized
- **Responsive images**: Different sizes for different screen sizes
- **Cropping**: Built-in cropping tool with 4:3 aspect ratio

### Image Management
- **Delete images**: Remove images with automatic Cloudinary cleanup
- **Main image**: First image is automatically set as main
- **Preview**: Instant preview of uploaded images
- **Progress tracking**: Upload progress indicators

### Performance Features
- **Auto-format**: Automatically serves WebP/AVIF for supported browsers
- **Auto-quality**: Optimizes image quality based on content
- **Responsive sizing**: Serves appropriate image sizes for different devices
- **CDN delivery**: Global CDN for fast image loading

## 6. Usage in Admin Panel

1. Go to `/admin/cars/new` or `/admin/cars/[id]/edit`
2. Click the **"Upload Photos"** button
3. Select images from your device or drag & drop
4. Crop images if needed (4:3 aspect ratio recommended)
5. Reorder images by dragging them
6. Save the car to store image URLs

## 7. Image Transformations

The system automatically applies these transformations:
- **f_auto**: Automatic format selection (WebP/AVIF when supported)
- **q_auto**: Automatic quality optimization
- **c_fill**: Crop to fill specified dimensions
- **w_400,h_300**: Thumbnail size for car cards
- **w_800,h_600**: Large size for car detail pages

## 8. Storage Structure

Images are organized in Cloudinary as:
\`\`\`
hope-autos/
  cars/
    [public-id-1].jpg
    [public-id-2].jpg
    ...
\`\`\`

## 9. Troubleshooting

### Upload Widget Not Loading
- Check that `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set correctly
- Verify the upload preset name matches exactly: `hope-autos-cars`
- Ensure the preset is set to "Unsigned" mode

### Images Not Displaying
- Verify Cloudinary URLs are being stored correctly
- Check browser console for CORS or loading errors
- Test image URLs directly in browser

### Delete Not Working
- Ensure `CLOUDINARY_API_SECRET` is set for server-side operations
- Check that the public ID extraction is working correctly

## 10. Production Considerations

- Enable **Auto Backup** in Cloudinary settings
- Set up **Webhooks** for advanced image processing
- Configure **Access Control** for security
- Monitor **Usage Quotas** and upgrade plan if needed
- Set up **Image Moderation** for user-generated content

## 11. Cost Optimization

- Use **Auto Quality** to reduce file sizes
- Enable **Progressive JPEG** for better perceived performance
- Set up **Eager Transformations** for commonly used sizes
- Use **Responsive Images** to serve optimal sizes
\`\`\`

## 🎯 **Key Features Implemented:**

### **1. Cloudinary Integration**
- **Upload Widget**: Professional upload interface with cropping
- **Multiple Images**: Support for up to 8 images per car
- **Auto-Optimization**: Automatic format and quality optimization
- **Responsive Images**: Different sizes for different use cases

### **2. Image Management**
- **Drag & Drop Reordering**: Rearrange images by dragging
- **Delete with Cleanup**: Remove images from both database and Cloudinary
- **Main Image Selection**: First image automatically becomes main
- **Visual Feedback**: Loading states and progress indicators

### **3. Performance Features**
- **Auto-Format**: WebP/AVIF delivery for modern browsers
- **Responsive Sizing**: Optimal image sizes for different devices
- **CDN Delivery**: Global CDN for fast loading
- **Lazy Loading**: Built-in Next.js Image optimization

### **4. User Experience**
- **Visual Upload Interface**: Professional drag-and-drop interface
- **Progress Tracking**: Upload progress and status indicators
- **Error Handling**: Graceful error handling and user feedback
- **Mobile Responsive**: Works perfectly on all devices

### **5. Admin Features**
- **Bulk Upload**: Upload multiple images at once
- **Image Gallery**: Beautiful gallery view in admin and public
- **Storage Management**: Automatic cleanup of deleted images
- **Backup Integration**: Ready for Cloudinary's backup features

The image upload system is now fully functional and production-ready. You can upload, manage, and display car photos with automatic optimization and global CDN delivery!
