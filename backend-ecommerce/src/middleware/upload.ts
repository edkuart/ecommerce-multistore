import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = /^image\/(png|jpe?g|webp|gif|avif)$/.test(file.mimetype);
  if (!allowed) {
    cb(new Error("Image format not allowed"));
    return;
  }

  cb(null, true);
};

export const uploadProductImages = multer({
  storage,
  limits: {
    files: 5,
    fileSize: 8 * 1024 * 1024,
  },
  fileFilter,
});
