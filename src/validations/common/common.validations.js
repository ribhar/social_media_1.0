 const Joi = require("joi");

const allowedImageMimetype = (mime) =>
  [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/bmp",
    "image/x-ms-bmp",
    "image/webp",
  ].includes(mime.toString());

const validateImage = (req, file, callback) => {
  if (allowedImageMimetype(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

// Upload Limits
// Sizes are in bytes
// 5242880 - 5mb, 10485760 - 10mb
const limits = {
  profileImage: { fileSize: 5242880 },
  postImage: { fileSize: 5242880 },
};

// paths for s3 uploads
const path = {
  profileImage: "Profile-Pictures",
  postImage: "Posts",
};

// file names for s3 uploads
const fileName = {
  profileImage: "profile_picture",
  postImage: "posts",
};




module.exports = {
  limits,
  path,
  fileName,
  validateImage,
};
