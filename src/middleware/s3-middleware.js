const multer = require("multer");
const multerS3 = require("multer-s3");
const { aws } = require("../configs/config");
const s3 = require("../configs/s3");
const commonValidations = require("../validations/common/common.validations");

// Function to upload to S3
const uploadTOS3 = (uploadConfig) =>
  multer({
    limits: uploadConfig.limits,
    fileFilter: uploadConfig.fileFilter,
    storage: multerS3({
      s3: s3,
      bucket: aws.bucket,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const timestamp = Date.now();
        const dynamicPath = uploadConfig.path;
        const path = `${dynamicPath}/${timestamp}`;
        cb(null, path);
      },
    }),
});

// Function to delete a file from S3
const deleteFileFromS3 = async (fileKey) => {
  const params = {
    Bucket: aws.bucket,
    Key: fileKey,
  };

  try {
    await s3.deleteObject(params).promise();
    console.log(`File deleted from S3: ${fileKey}`);
  } catch (error) {
    console.error(`S3 file deletion error: ${error}`);
  }
};

module.exports = { uploadTOS3, deleteFileFromS3 };