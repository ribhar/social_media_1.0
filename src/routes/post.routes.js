const express = require("express");
const { postController } = require("../controllers")
const { uploadTOS3 } = require("../middleware/s3-middleware");
const {
  limits,
  path,
  fileName,
  validateImage,
} = require("../validations/common/common.validations");

const router = express.Router();

router.get("/", postController.postRouterHome);

router.get("/all", postController.allPost);

router.get("/all/:id", postController.singleUserAllPost);

router.get("/:id", postController.singlePost);

router.get("/userPost/:id", postController.allPost);

router.post("/new",uploadTOS3({
    limits: limits.postImage,
    fileFilter: validateImage,
    path: path.postImage,
  }).array(fileName.postImage, 2), postController.createPost);

router.patch("/update/:id", postController.updatePost);

router.delete("/delete/:id", postController.deletePost);

router.post("/:id/like", postController.likePost);

router.post("/:id/unlike", postController.unLikePost);

router.get("/:id/postlikes", postController.getPostLikes);


// Comments

router.get("/:id/comments", postController.singlePostComment);

router.patch("/comment/update/:id", postController.updateComment);

router.delete("/comment/delete/:id", postController.deleteComment);

router.post("/comment/new", postController.createComment);

router.post("/comment/newreply", postController.createCommentReply);


module.exports = router;