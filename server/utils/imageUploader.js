import { v2 as cloudinary } from "cloudinary";

export const uploadFileToCloudinary = async (file, folder) => {
  try {
    const options = {
      folder: folder,
      resource_type: "auto",
    };

    const result = await cloudinary.uploader.upload(
      file.tempFilePath,
      options
    );

    return result; // ✅ VERY IMPORTANT

  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    throw error;
  }
};