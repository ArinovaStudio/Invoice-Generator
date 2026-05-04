import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage( file: File, subfolder: string = "invoices" ): Promise<{ url: string | null; error: string | null }> {
  try {
    if (!file) {
      return { url: null, error: "No file provided for upload" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const response = await cloudinary.uploader.upload(base64Image, {
      folder: `arinvoice/${subfolder}`,
      resource_type: "auto",
    });

    return { url: response.secure_url, error: null };
  } catch {
    return { url: null, error: "Failed to upload image to Cloudinary." };
  }
}

export async function deleteImage(fileUrl: string): Promise<{ success: boolean; error: string | null }> {
  try {
    if (!fileUrl) {
      return { success: false, error: "No file URL provided." };
    }

    const urlParts = fileUrl.split("/");
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    const fileName = fileNameWithExtension.split(".")[0];
    
    const folderIndex = urlParts.indexOf("arinvoice");
    const publicId = urlParts.slice(folderIndex).join("/").split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return { success: false, error: "Failed to delete the image from Cloudinary." };
    }

    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to delete the image from Cloudinary." };
  }
}