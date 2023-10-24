const mongoose = require("mongoose");


const FollowSchema = mongoose.Schema({
    followerID: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user",
         required: true
    },
    followingID: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user",
         required: true
    },
})


const FollowModel = mongoose.model('follow', FollowSchema);

module.exports = { FollowModel };