import { Request, Response, NextFunction } from "express";
import Post from "../models/postModel";

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
    const { title, imageUrl, content, creator } = req.body;
    const post = new Post({
      title: title,
      imageUrl: imageUrl,
      content: content,
      creator: creator,
    });
    const createdPost = await post.save();
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
    const { title, imageUrl, content, creator } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("updatePost Controller Could not find postId");
      throw error;
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

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Failed to find Post with matching Id");
      throw error;
    }
    const result = await Post.findByIdAndRemove(postId);
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
