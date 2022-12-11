const {extname} = require("path");
const Attachment = require("./Attachment");
const AppError = require("../utils/constants/appError");
const catchAsync = require("../utils/constants/catchAsync");
const fileUploader = require("../middlewares/fileUpload");
const QueryBuilder = require('../utils/QueryBuilder')
const fs = require("fs");

exports.getAllAttachments = catchAsync(async (req, res, next) => {
    const queryBuilder = new QueryBuilder(req.query)

    queryBuilder
        .filter()
        .paginate()
        .limitFields()
        .search()
        .sort()

    let allAttachments = await Attachment.findAndCountAll(queryBuilder.queryOptions);
    allAttachments = queryBuilder.createPagination(allAttachments)
    res.json({
        status: 'success',
        message: 'All attachments found',
        data: {
            allAttachments
        },

    })
})

exports.uploadAttachments = catchAsync(async (req, res, next) => {
    const files = req.files;
    console.log(files)
    let attachments = [];
    // console.log(files)
    // console.log(extname(files[0].originalname))
    for (let i = 0; i < files?.length; i++) {
        let imageUploader;
        const file = {
            // name: "",
            originalName: files[i].originalname,
            size: files[i].encoding,
            type: extname(files[i].originalname),
            mimeType: files[i].mimetype,
        };

        const uploadedFileName = await fileUploader(files[i]);
        file.name = uploadedFileName;
        const newAttachment = await Attachment.create(file);
        attachments.push(newAttachment);
    }
    res.status(201).json({
        status: "success",
        message: "Created new Attachments",
        error: null,
        data: {
            attachments,
        },
    });
});

exports.getById = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const attachmentById = await Attachment.findByPk(id);
    if (!attachmentById) {
        return next(new AppError(`File with id:${id} not found`, 404));
    }
    res.json({
        status: "success",
        message: "",
        error: null,
        data: {
            attachmentById,
        },
    });
});

exports.updateAttachment = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const files = req.files;
    // console.log(files)
    const attachmentById = await Attachment.findByPk(id);
    if (!attachmentById) {
        return next(new AppError(`File with id:${id} not found`), 404);
    }
    // console.log(files[0])
    const fileName = Date.now().toString() + extname(files[0].originalname);

    let file = {
        name: fileName,
        originalName: files[0].originalname,
        size: files[0].encoding,
        type: extname(files[0].originalname),
        mimeType: files[0].mimetype,
    };

    await fileUploader(files[0]);
    console.log(file)
    const updatedAttachment = await attachmentById.update(file);
    res.json({
        status: "success",
        message: "Attachment's info updated",
        error: null,
        data: {
            updatedAttachment,
        },
    });
});

exports.deleteAttachment = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const attachmentById = await Attachment.findByPk(id);
    if (!attachmentById) {
        return next(new AppError(`Attachment with id ${id} not found`, 404));
    }

    try {
        fs.unlink(`static/uploads/${attachmentById.name}`, async (err) => {
            if (err) {
                console.log(err);
            }
            await attachmentById.destroy();
        });
    } catch (error) {
        console.log(error);
    }


    res.json({
        status: "success",
        message: "Deleted Attachment",
        error: null,
    });
});

exports.downloadAttachment = async (req, res, next) => {

    const {id} = req.params;
    const attachmentById = await Attachment.findByPk(id);

    let filePath = `./static/uploads/${attachmentById.name}`;

    res.download(filePath);


}