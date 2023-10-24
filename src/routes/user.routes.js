const express = require("express");
const { userController } = require("../controllers");
const { uploadTOS3 } = require("../middleware/s3-middleware");
const { limits, path, fileName, validateImage} = require("../validations/common/common.validations");

const router = express.Router();

// Auth
router.get("/:id", userController.userDetail);

router.get("/", userController.userQuery);

router.post(
  "/register",
  uploadTOS3({
    limits: limits.profileImage,
    fileFilter: validateImage,
    path: path.profileImage,
  }).single(fileName.profileImage),
  userController.userRegisteration
);

router.post("/login", userController.userLogin);

router.post("/login/jwt", userController.userLoginJWT);

router.post("/logout", userController.userLogout);

router.post(
  "/update/:id",
  uploadTOS3({
    limits: limits.profileImage,
    fileFilter: validateImage,
    path: path.profileImage,
  }).single(fileName.profileImage),
  userController.updateUser
);

router.delete("/delete/:id", userController.deleteUser);

router.patch("/newpassword/:id", userController.updatePassword);

// Follow
router.post("/follow", userController.followUser);

router.post("/unfollow", userController.unFollowUser);

router.get("/:id/follower", userController.userFollower);

router.get("/:id/follow/all", userController.userAllFollow);

router.get("/:id/following", userController.userFollowing);

module.exports = router;
