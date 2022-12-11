const {extname} = require("path");
const multer = require("multer");
const AppError = require("../utils/constants/appError");
const catchAsync = require("../utils/constants/catchAsync");
const fileTypes = [
  ".png",
  ".jpeg",
  ".svg",
  ".webp",
  ".pdf",
  ".jpg",
  ".xls",
  "xlsx",
  ".ppt",
  ".pptx",
  ".doc",
  ".docx",
];

const storage = multer.memoryStorage();
const filter = catchAsync(async (req, file, cb) => {
  if (fileTypes.includes(extname(file.originalname.toLowerCase()))) {
    cb(null, true);
  } else {
    cb(
        new AppError(
            `You cannot upload file format of ${extname(
                file.originalname.toLowerCase()
            )}`,
            400
        )
    );
  }
});

exports.fileUploader = multer({
  storage,
  fileFilter: filter,
});
