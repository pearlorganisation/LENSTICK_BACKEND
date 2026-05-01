import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../utils/commonService/s3.util.js";

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_Bucket_Name,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `products/${Date.now()}-${file.originalname}`);
    },
  }),
});
