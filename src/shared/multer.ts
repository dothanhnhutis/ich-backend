import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export default multer({ storage });
