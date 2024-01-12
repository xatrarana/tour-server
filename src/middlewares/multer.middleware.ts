import multer from "multer";
import fs from "fs";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fieldName = file.fieldname;
    const destinationFolder = `./src/uploads/temp/${fieldName}`;

    fs.mkdirSync(destinationFolder, { recursive: true });

    cb(null, destinationFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const upload = multer({
  storage,
});
