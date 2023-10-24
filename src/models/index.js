const mongoose = require("mongoose");
const config = require("../configs/config");
const { PostModel } = require("./post.model");
const { LikesModel } = require("./like.model");
const { CommentModel } = require("./comment.model");
const { CommentLikeModel } = require("./comment-like.model");
const { FollowModel } = require("./follow.model");
const { UserModel} = require("./user.model");
mongoose.set("strictQuery", false);

const connection = mongoose.connect(config.db.dbURI);
module.exports.connection = connection;

module.exports.postModel = PostModel;
module.exports.likesModel = LikesModel;
module.exports.commentModel = CommentModel;
module.exports.commentLikeModel = CommentLikeModel;
module.exports.userModel = UserModel;
module.exports.followModel = FollowModel;
