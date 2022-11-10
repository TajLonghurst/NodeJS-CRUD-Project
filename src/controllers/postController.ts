import { Request, Response, NextFunction } from "express";
import Post from "../models/postModel";

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const getPosts = await Post.find();
    res.status(200).json({
      post: getPosts,
    });
  } catch (err: any) {
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
    next(err);
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId;
    const { title, imageUrl, content, creator } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post Id not recinzied");
      //   error.statusCode = 404;
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
    next(err);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Failed to find Post with matching Id");
      //   error.statusCode = 404;
      throw error;
    }
    const result = await Post.findByIdAndRemove(postId);
    res.status(200).json({
      message: "Posted Deleted From database",
      postRemoved: result,
    });
  } catch (err) {
    next(err);
  }
};

export default { getPosts, createPost, updatePost, deletePost };
