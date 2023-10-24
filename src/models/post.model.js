const mongoose = require("mongoose");
const { LikesModel } = require('./like.model')
const { CommentModel } = require('./comment.model')
const { CommentLikeModel } = require('./comment-like.model');

const PostSchema = mongoose.Schema({
     caption: {
          type: String,
          required: true
     },
     mediaUrls: [
          {
               type: String, // Change the type to String
          },
     ],
     likesCount: {
          type: Number,
          required: true,
          default: 0
     },
     likes: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'like', default: [] }
     ],
     comments: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'comment', default: [] }
     ],
     author: { 
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user', 
          required: true,
          immutable: true,
     },
     createdAt: {
          type: Number,
          immutable: true,
          default: () => Date.now()
     },
     updateAt: {
          type: Number,
          default: () => Date.now()
     },
     edited: {
          type: Boolean,
          default: false
     }
})

PostSchema.methods.removeRecords = async function (next) {
  try {
    const postID = this._id; 
    await PostModel.deleteOne({ _id: postID }); 
    await LikesModel.deleteMany({ postID: postID }); 
    await CommentModel.deleteMany({ postID: postID }); 
    await CommentLikeModel.deleteMany({ postID: postID }); 
    next();
  } catch (error) {
    console.log('error: ', error);
  }
};

const PostModel = mongoose.model('post', PostSchema);

module.exports = { PostModel };