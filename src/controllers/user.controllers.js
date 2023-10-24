const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcrypt');
const catchAsync = require("../utils/catchAsync");
const { userModel, followModel, postModel } = require("../models");
const { deleteFileFromS3 } = require('../middleware/s3-middleware');

class UserController {
  // Fetch user details by ID
  userDetail = catchAsync(async (req, res) => {
    const id = req.params.id;
    const user = await userModel.findById(id);
    res.status(200).json({ msg: "User details fetched", credentials: user });
  });

  // Search for users based on a query parameter
  userQuery = catchAsync(async (req, res) => {
    const { user } = req.query;
    const FindUser = await userModel.find({
      $or: [
        { username: { $regex: user || "", $options: "i" } },
        { email: { $regex: user || "", $options: "i" } },
      ],
    });
    res.status(200).json({ msg: "User details fetched", users: FindUser });
  });

  // Handle user registration
  userRegisteration = catchAsync(async (req, res) => {
    try {
      const { password, ...payload } = req.body;
      const CheckUser = await userModel.findOne({ email: payload.email });
  
      if (CheckUser) {
        // Call deleteFileFromS3 to delete the uploaded file on error
        if (req.file && req.file.location) {
          await deleteFileFromS3(req.file.location);
        }
        return res.status(400).json({ message: "User already exists" });
      }
  
      const hash = await bcrypt.hash(password, 5);
      const user = new userModel({
        ...payload,
        password: hash,
      });

      if(req.file.location){
        user.photoURL = req.file.location
      }

      await user.save();
  
      return res.status(201).json({
        status: 200,
        message: "Registration success",
        credentials: user,
      });
    } catch (error) {
      console.error("Error during user registration:", error);
  
      // Call deleteFileFromS3 to delete the uploaded file on error
      if (req.file && req.file.location) {
        await deleteFileFromS3(req.file.location);
      }
  
      return res.status(500).json({ message: "Registration failed" });
    }
  });
  

  // Handle user login using Passport Local Strategy
  userLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        user.getAuthorizationToken();
        return res.status(200).json({
          status: 200,
          message: 'Login Success',
          credentials: user,
          token: user.token, 
        });
      });
    })(req, res, next);
  }

  // Handle user login using Passport JWT Strategy
  userLoginJWT = (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      return res.status(200).json({
        status: 200,
        message: 'Login Success',
        credentials: user,
        token: req.headers.authorization.split(' ')[1], 
      });
    })(req, res, next);
  }

  // Log out the user
  userLogout = catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      user.lastLogin = Date.now();
      user.online = false;
      user.token = '';
      await user.save();
      res.status(201).json({ status: 200, message: "Logout Success" });
    } else {
      res.status(201).json({ status: 400, message: "User not found." });
    }
  });

  // Update user details
  updateUser = catchAsync(async (req, res) => {
    const _id = req.params.id;
    const payload = req.body;
    if(req.file.location){
      payload.photoURL = req.file.location
    }
    let user = await userModel.findOne({ _id });
    Object.assign(user, payload);
    await user.save();
    return res
      .status(201)
      .json({
        status: 200,
        message: "User has been updated",
        credentials: user,
      });
  });

  // Delete user account
  deleteUser = catchAsync(async (req, res) => {
    const _id = req.params.id;
    const user = await userModel.findById(_id);
    await user.removeRecords();
    return res
      .status(201)
      .json({ status: 200, message: "User has been deleted" });
  });

  // Update user password
  updatePassword = catchAsync(async (req, res) => {
    const _id = req.params.id;
    const { password } = req.body;
    let user = await userModel.findById(_id);
    user.password = password;
    await user.save();
    return res
      .status(201)
      .json({
        status: 200,
        message: "Password has been updated",
        credentials: user,
      });
  });

  // Follow a user
  followUser = catchAsync(async (req, res) => {
    const payload = req.body;

    const followerID = mongoose.Types.ObjectId(payload.followerID);
    const followingID = mongoose.Types.ObjectId(payload.followingID);
    const follow = new followModel({
      // userID,
      followerID: followingID,
      followingID: followingID,
    });
    await follow.save();
    const user = await userModel.findById(followerID);
    user.followingCount++;
    await user.save();
    const targetUser = await userModel.findById(followingID);
    targetUser.followerCount++;
    await targetUser.save();
    return res
      .status(201)
      .json({ status: 200, message: "Followed the user.", credentials: user });
  });

  // Unfollow a user
  unFollowUser = catchAsync(async (req, res) => {
    const payload = req.body;
    const followerID = mongoose.Types.ObjectId(payload.followerID);
    const followingID = mongoose.Types.ObjectId(payload.followingID);
    await followModel.findOneAndDelete({
      // userID,
      followerID: followingID,
      followingID: followingID,
    });
    const user = await userModel.findById(followerID);
    user.followingCount--;
    await user.save();
    const targetUser = await userModel.findById(followingID);
    targetUser.followerCount--;
    await targetUser.save();
    return res
      .status(201)
      .json({
        status: 200,
        message: "Unfollowed the user.",
        credentials: user,
      });
  });

  // Get user's followers
  userFollower = catchAsync(async (req, res) => {
    const id = req.params.id;
    const followers = await followModel.find({ followingID: id }).populate(
      "followerID"
    );
    return res
      .status(201)
      .json({ status: 200, message: "User followers.", followers });
  });

  // Get user's following
  userFollowing = catchAsync(async (req, res) => {
    const id = req.params.id;
    const following = await followModel.find({ followerID: id }).populate(
      "followingID"
    );
    return res
      .status(201)
      .json({ status: 200, message: "User following.", following });
  });

  // Get both users that the user is following and followers
  userAllFollow = catchAsync(async (req, res) => {
    const id = req.params.id;
    const following = await followModel.find({ followerID: id }).populate(
      "followingID"
    );
    const followers = await followModel.find({ followingID: id }).populate(
      "followerID"
    );
    return res
      .status(201)
      .json({
        status: 200,
        message: "User following and followers.",
        following,
        followers,
      });
  });

}

module.exports = new UserController();
