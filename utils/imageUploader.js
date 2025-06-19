import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImages(images) {
  try {
    const uploadPromises = images.map((image) =>
      cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults.map((result) => result.secure_url);
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error("Image upload failed.");
  }
}
