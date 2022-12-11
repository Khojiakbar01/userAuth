// const {extname} = require("path");
// const multer = require("multer");
// const storage = multer.diskStorage({
//     destination: "./static/uploads",
//     filename: (req, file, cb) => {
//         console.log(file);
//         const fileName = Date.now().toString() + extname(file.originalname);
//         cb(null, fileName);
//     }
// });
//
//
// const upload = multer({storage});
//
// export const uploader = (req, res) => {
//     upload.single()
//     res.send("Single FIle upload success");
// }
//
// module.exports = upload;
