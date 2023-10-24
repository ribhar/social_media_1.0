const { postModel, mediaUrlModel, commentModel, likesModel, userModel } = require("../models");

const catchAsync = require("../utils/catchAsync");

class PostController {

  postRouterHome = catchAsync(async (req, res) => {
    res.send("Home Post Page");
  });

  allPost = catchAsync(async (req, res) => {
    // Fetch all posts, and populate author, comments, and likes
    const posts = await postModel.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        model: userModel, 
        select: "username photoURL",
      })
      .populate({
        path: "comments",
        model: commentModel, 
        populate: {
          path: "author",
          model: userModel, 
          select: "username photoURL",
        },
      })
      .populate({
        path: "likes",
        model: likesModel,
        populate: {
          path: "author",
          model: userModel, 
          select: "username photoURL",
        },
      })
      .select("title description content createdAt comments likesCount"); 
  
    res.status(200).json({
      status: 200,
      posts,
      message: "Feed of all posts has been sent.",
    });
  });


  singlePost = catchAsync(async (req, res) => {
    const id = req.params.id;
    const post = await postModel.findById(id).populate([
      { path: "author", model: "user" },
      {
        path: "comments",
        model: "Comment",
        populate: {
          path: "author",
          model: "user",
        },
      },
    ]);
    res.status(200).json({ status: 200, post, message: "Post has been sent." });
  });

  singleUserAllPost = catchAsync(async (req, res) => {
    const id = req.params.id;
    const posts = await postModel.find({ author: id })
      .populate([
        { path: "author", model: "user" },
        {
          path: "comments",
          model: "comment",
          populate: {
            path: "author",
            model: "user",
          },
        },
      ])
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ status: 200, posts, message: "All posts have been sent." });
  });

  createPost = catchAsync(async (req, res) => {
    const user = req.user;
    let caption = req.body.caption;
    let mediaUrls = [];
  
    if (req.files.length) {
      // Extract "location" from each element of req.files
      mediaUrls = req.files.map((file) => file.location);
    }
  
    if (caption || mediaUrls.length) {
      const newPost = new postModel({
        author: user._id,
        caption: caption,
        mediaUrls: mediaUrls,
      });
  
      await newPost.save();
  

  
      res.status(201).json({
        status: 201,
        message: "Post created successfully",
        post: newPost,
      });
    } else {
      res.status(400).json({ message: "Invalid request. Provide a caption or media." });
    }
  });
  

  updatePost = catchAsync(async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    let post = await postModel.findOne({ _id: id });
    const data = { ...payload, updatedAt: Date.now(), edited: true };
    Object.assign(post, data);
    await post.save();
    res
      .status(201)
      .json({ status: 200, message: "Post has been updated.", post });
  });

  deletePost = catchAsync(async (req, res) => {
    const id = req.params.id;
    const post = await postModel.findById(id);
    await post.removeRecords();
    res.status(201).json({ status: 200, message: "Post has been deleted." });
  });

  singlePostComment = catchAsync(async (req, res) => {
    const id = req.params.id;
    const postComment = await commentModel.find({ postID: id })
      .sort({ createdAt: -1 })
      .populate("author");
    res
      .status(200)
      .json({
        status: 200,
        message: "Post comment has been sent.",
        postComment,
      });
  });

  createComment = catchAsync(async (req, res) => {
    const payload = req.body;
    const author = req.user._id;
    const comment = new commentModel({
      ...payload,
      author, 
    });
    
    let post = await postModel.findById(payload.postID);
    const postComment = post.comments;
    postComment.push(comment._id);
    await comment.save();
    await post.save();

    res
      .status(201)
      .json({ status: 200, message: "Comment has been created.", comment });
  });

  createCommentReply = catchAsync(async (req, res) => {
    const payload = req.body;
    const comment = new commentModel(payload);
    await comment.save();

    const parentComment = await commentModel.findById(payload.parentID);
    parentComment.child.push(comment._id);
    await parentComment.save();

    const post = await postModel.findById(payload.postID);
    post.comments.push(comment._id);
    await post.save();

    res
      .status(201)
      .json({ status: 200, message: "Comment has been created.", comment });
  });

  updateComment = catchAsync(async (req, res) => {
    const id = req.params.id;
    const { message } = req.body;
    const comment = await commentModel.findById(id);
    comment.message = message;
    comment.edited = true;    await comment.save();
    res.status(201).json({ status: 200, message: "Comment has been updated." });
  });

  deleteComment = catchAsync(async (req, res) => {
    const id = req.params.id;
    const comment = await commentModel.findById(id);
    await comment.removeRecords();
    res.status(201).json({ status: 200, message: "Comment has been deleted." });
  });

  likePost = catchAsync(async (req, res) => {
    const id = req.params.id;
    const author = req.user._id;

    const check = await likesModel.findOne({
      postID: id,
      author,
    });
    if (check) {
      return res
        .status(403)
        .json({ status: 403, msg: "Already liked the post" });
    }

    const like = new likesModel({
      postID: id,
      author,
    });
    
    const likes = await likesModel.find({ authorID: author });
    
    const post = await postModel.findById(id);
    post.likesCount++;
    const postLikes = post.likes;
    postLikes.push(like._id);
    await post.save();
    await like.save();

    res.status(201).json({
        status: 200,
        message: "Like has been updated in the post.",
        likes,
      });
  });

  unLikePost = catchAsync(async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    await likesModel.findOneAndDelete({
      postID: id,
      authorID: userId,
      author: userId,
    });

    const likes = await likesModel.find({ authorID: userId });

    const post = await postModel.findById(id);
    post.likes--;
    await post.save();

    res.status(201).json({ status: 200, message: "Like has been deleted.", likes });
  });

  getPostLikes = catchAsync(async (req, res) => {
    const id = req.params.id;
    const likes = await likesModel.find({ authorID: id });

    res.status(201).json({ status: 200, message: "Likes list of user.", likes });
  });
}

module.exports = new PostController();
