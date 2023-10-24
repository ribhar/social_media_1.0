const mongoose = require("mongoose");

const LikesSchema = mongoose.Schema({
    postID: { 
         type: mongoose.Schema.Types.ObjectId,
         ref: 'post', 
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


const LikesModel = mongoose.model('like', LikesSchema);

module.exports = { LikesModel };