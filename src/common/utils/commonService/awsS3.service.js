import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3.util.js";
import CustomError from "../customError.js";

class S3Service {

  
  static getKeyFromUrl(url) {
    if (!url) throw new CustomError("URL is required", 400);
    return url.split(".com/")[1];
  }

  //  Format uploaded files (multer-s3)(simply converts uploaded files into { url, key, type } format)
  static formatUploadedFiles(files) {
    if (!files || files.length === 0) return [];

    return files.map((file) => ({
      url: file.location,
      key: file.key,
      type: file.mimetype.startsWith("image/") ? "image" : "document",
    }));
  }

  //  Delete single file (deletes the file (image or document))
  static async deleteFile(key) {
    if (!key) throw new CustomError("Key is required", 400);

    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_Bucket_Name,
          Key: key,
        })
      );

      return true;
    } catch (error) {
      console.error("S3 Delete Error:", error);
      throw new CustomError("Failed to delete file from S3", 500);
    }
  }

  // 🔹 Delete multiple files
  static async deleteMultipleFiles(keys = []) {
    if (!Array.isArray(keys) || keys.length === 0) return;

    try {
      await Promise.all(keys.map((key) => this.deleteFile(key)));
      return true;
    } catch (error) {
      throw new CustomError("Failed to delete multiple files", 500);
    }
  }

  //  Replace single file (update)
  static async replaceFile(oldKey, newFile) {
    if (!newFile) throw new CustomError("New file is required", 400);

    try {
      const newFileData = {
        url: newFile.location,
        key: newFile.key,
        type: newFile.mimetype.startsWith("image/") ? "image" : "document",
      };

      if (oldKey) {
        await this.deleteFile(oldKey);
      }

      return newFileData;
    } catch (error) {
      throw new CustomError("Failed to replace file", 500);
    }
  }

  // Replace multiple files
  static async replaceMultipleFiles(oldKeys = [], newFiles = []) {
    try {
      const newFileData = this.formatUploadedFiles(newFiles);

      if (oldKeys.length > 0) {
        await this.deleteMultipleFiles(oldKeys);
      }

      return newFileData;
    } catch (error) {
      throw new CustomError("Failed to replace multiple files", 500);
    }
  }
}

export default S3Service;
