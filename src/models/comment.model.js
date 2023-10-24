const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
    message: {
         type: String,
         required: true
    },
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
    createdAt: {
         type: Number,
         required: true,
         immutable: true,
         default: () => Date.now()
    },

    parent: {
         type: mongoose.Schema.Types.ObjectId,
         immutable: true,
    },

    parentID: {
         type: String,
         immutable: true,
         default: null
    },

    child: [
         { type: mongoose.Schema.Types.ObjectId, ref: 'comment', default: [] }
    ],

    edited: {
         type: Boolean,
         default: false
    },

    likes: [
         { type: mongoose.Schema.Types.ObjectId, ref: 'comment-like', default: [] }
    ]

})

CommentSchema.methods.removeRecords = async function () {
    try {
         await CommentModel.findByIdAndDelete(this._id);
         await CommentModel.deleteMany({ parentID: this._id });
    } catch (error) {
         console.log('error: ', error);
    }
}

const CommentModel = mongoose.model('comment', CommentSchema);

module.exports = { CommentModel };