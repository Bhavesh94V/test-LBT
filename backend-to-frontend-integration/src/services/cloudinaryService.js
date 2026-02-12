import { initializeCloudinary } from '../config/cloudinary.js';

class CloudinaryService {
  async uploadImage(file, folder = 'letsbuy') {
    try {
      const cloudinary = initializeCloudinary();
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(file.buffer);
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async uploadMultipleImages(files, folder = 'letsbuy') {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadImage(file, folder)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  }

  async deleteImage(publicId) {
    try {
      const cloudinary = initializeCloudinary();
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  async uploadProfilePicture(file, userId) {
    try {
      return await this.uploadImage(file, `letsbuy/profiles/${userId}`);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  async uploadPropertyGallery(files, propertyId) {
    try {
      return await this.uploadMultipleImages(
        files,
        `letsbuy/properties/${propertyId}`
      );
    } catch (error) {
      console.error('Error uploading property gallery:', error);
      throw error;
    }
  }

  async uploadPropertyLayout(file, propertyId) {
    try {
      return await this.uploadImage(
        file,
        `letsbuy/layouts/${propertyId}`
      );
    } catch (error) {
      console.error('Error uploading layout:', error);
      throw error;
    }
  }
}

export default new CloudinaryService();
