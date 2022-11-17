import { Request, Response, NextFunction } from "express";
import { ExtendedRequest } from "../middleware/Is-Auth";
import Post from "../models/postModel";
import User from "../models/userModel";
import { clearImage } from "../middleware/clearImages";

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find();
    if (!posts) {
      const error = new Error("Could not find posts");
      throw error;
    }
    res.status(200).json({
      posts: posts,
    });
  } catch (err: any) {
    err.message = "Failed to find posts";
    err.statusCode = 404;
    next(err);
  }
};

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageUrl = req.file?.path.replace("\\", "/");
    if (!imageUrl) {
      const error = new Error("Could not find file");
      throw error;
    }
    const { title, content, creator: userId } = req.body;
    const post = new Post({
      title: title,
      imageUrl: imageUrl,
      content: content,
      creator: userId,
    });
    const createdPost = await post.save();
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Could not userId to add to newly created post");
      throw error;
    }
    user.posts.push(post);
    await user.save();
    res.status(201).json({
      post: createdPost,
    });
  } catch (err: any) {
    err.message = "Failed to Create Post";
    err.statusCode = 404;
    next(err);
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId;
    const { title, content, creator } = req.body;
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      const error = new Error("Image was not picked");
      throw error;
    }
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("updatePost Controller Could not find postId");
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage([post.imageUrl]);
    }
    post.set({
      title: title,
      imageUrl: imageUrl,
      content: content,
      creator: creator,
    });
    const updatedPost = await post.save();
    res.status(200).json({
      post: updatedPost,
    });
  } catch (err: any) {
    err.message = "Post ID was not reconized";
    err.statusCode = 404;
    next(err);
  }
};

const deletePost = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Failed to find Post with matching Id");
      throw error;
    }
    clearImage([post.imageUrl]);
    const result = await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Failed to find user with matching Id");
      throw error;
    }
    user.posts.pull(postId);
    await user.save();
    res.status(200).json({
      message: "Posted Deleted From database",
      postRemoved: result,
    });
  } catch (err: any) {
    err.message = "Failed to find Post with matching ID";
    err.statusCode = 404;
    next(err);
  }
};

export default { getPosts, createPost, updatePost, deletePost };
