const express = require("express");
const {body} = require("express-validator");
const attachmentController = require("./attachmentController");
const {fileUploader} = require("../middlewares/fileUploader");

const router = express.Router({mergeParams: true});

// router
//   .route("/")
//   .post(fileUploader.array("files"), attachmentController.uploadAttachments);

router.get('/list', attachmentController.getAllAttachments)
router.get('/:id', attachmentController.getById)
router.put('/update/:id',
    fileUploader.array("files"),
    body('files', 'Please upload file').notEmpty(),
    attachmentController.updateAttachment)
router.post('/upload',
    fileUploader.array("files"),
    body('files', 'Please upload file').notEmpty(),
    attachmentController.uploadAttachments)
router.get('/download/:id', attachmentController.downloadAttachment)
router.get('/delete/:id', attachmentController.deleteAttachment)

// router
//   .route("/:id")
//   .get(attachmentController.getById)
//   .put(uploader.array("files"), attachmentController.updateAttachment)
//   .delete(attachmentController.deleteAttachment);

module.exports = router;
