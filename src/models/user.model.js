const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { PostModel } = require('./post.model')
const { LikesModel } = require('./like.model')
const { CommentModel } = require('./comment.model')
const { CommentLikeModel } = require('./comment-like.model')
const config = require('../configs/config')

const userSchema = mongoose.Schema({
     username: {
          type: String,
          unique : true,
          required: true
     },
     email: {
          type: String,
          immutable: true,
          required: true,
          lowercase: true
     },
     password: {
          type: String,
          default: ''
     },
     gender: {
          type: String
     },
     online: {
          type: Boolean,
          required: true,
          default: false
     },
     photoURL: {
          type: String,
          default: ''
     },
     phoneNumber: {
          type: Number,
          default: 0,
     },
     occupation: {
          type: String,
          default: "",
     },
     bio: {
          type: String,
          default: "",
     },
     role: {
          type: String,
          default: "USER",
          enum: ["USER", "ADMIN"]
     },
     createdAt: {
          type: Number,
          immutable: true,
          default: () => Date.now()
     },
     lastLogin: {
          type: Number,
          default: () => Date.now()
     },
     token: {
          type: String
     },
     followerCount: {
          type: Number,
          required: true,
          default: 0,
     },
     followingCount: {
          type: Number,
          required: true,
          default: 0
     },
})

userSchema.methods.getAuthorizationToken = async function () {
     const token = jwt.sign({ email: this.email }, config.jwt.secret);
     this.online = true;
     this.token = token;
     await this.save();
     return token;
}

userSchema.methods.removeRecords = async function () {

     const userId = this._id

     await UserModel.findByIdAndDelete(userIds);

     await PostModel.deleteMany({ author: userId });

     await CommentModel.deleteMany({ author: userId });

     await CommentLikeModel.deleteMany({ author: userId });

     await LikesModel.deleteMany({ author: userId })

}

userSchema.methods.removeRecords = async function () {
  const userId = this._id; // Change userIds to userId
  await UserModel.findByIdAndDelete(userId);
  await PostModel.deleteMany({ author: userId });
  await CommentModel.deleteMany({ author: userId });
  await CommentLikeModel.deleteMany({ author: userId });
  await LikesModel.deleteMany({ author: userId });
};

const UserModel = mongoose.model('user', userSchema);

module.exports = { UserModel };