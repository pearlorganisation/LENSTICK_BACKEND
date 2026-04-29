import express from "express";
import { upload } from "../../common/middleware/upload.middleware.js";
import S3Service from "../../common/utils/commonService/awsS3.service.js";

const router = express.Router();

//  1. Upload files
router.post("/upload", upload.array("files", 5), (req, res) => {
  const files = S3Service.formatUploadedFiles(req.files);

  res.json({
    message: "Uploaded successfully",
    files,
  });
});

// 🔹 2. Delete single file (using key)
router.delete("/delete", async (req, res) => {
  try {
    const { key } = req.body;

    await S3Service.deleteFile(key);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Replace single file
router.put("/replace", upload.single("file"), async (req, res) => {
  try {
    const { oldKey } = req.body;

    const updated = await S3Service.replaceFile(oldKey, req.file);

    res.json({
      message: "File replaced successfully",
      file: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Replace multiple files
router.put("/replace-multiple", upload.array("files", 5), async (req, res) => {
  try {
    let oldKeys = req.body.oldKeys;

    console.log("old keys ", oldKeys);

    if (typeof oldKeys === "string") {
      try {
        oldKeys = JSON.parse(oldKeys);
      } catch {
        oldKeys = oldKeys.split(",");
      }
    }

    oldKeys = oldKeys || [];

    // oldKeys should be array
    // const parsedKeys = JSON.parse(oldKeys);

    const updated = await S3Service.replaceMultipleFiles(oldKeys, req.files);
    console.log("updated ", updated);

    res.json({
      message: "Files replaced successfully",
      files: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
