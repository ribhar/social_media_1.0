const mongoose = require("mongoose");

const CommentLikeSchema = mongoose.Schema({
    commentID: { 
         type: mongoose.Schema.Types.ObjectId,
         ref: 'comment', 
         required: true,
         immutable: true,
    },
    author: { 
         type: mongoose.Schema.Types.ObjectId,
         ref: 'user', 
         required: true,
         immutable: true,
    },
})

const CommentLikeModel = mongoose.model('comment-like', CommentLikeSchema);
module.exports = { CommentLikeModel };