import { Request, Response, NextFunction } from "express";
import { ExtendedRequest } from "../middleware/Is-Auth";
import Post from "../models/postModel";
import User from "../models/userModel";
import { clearImage } from "../middleware/clearImages";
import createError from "http-errors";
import mongoose from "mongoose";

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find();
    if (!posts) {
      throw createError(404, "Failed to find posts");
    }
    res.status(200).json({
      posts: posts,
    });
  } catch (err: any) {
    if (err instanceof mongoose.Error.CastError) {
      next(createError(404, "Failed to find posts"));
      return;
    }
    next(err);
  }
};

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageUrl = req.file?.path.replace("\\", "/");
    if (!imageUrl) {
      throw createError(404, "Could not find file");
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
      throw createError(404, "Could not find user");
    }
    user.posts.push(post);
    await user.save();
    res.status(201).json({
      post: createdPost,
    });
  } catch (err: any) {
    if (err instanceof mongoose.Error.CastError) {
      next(createError(404, "could not find user"));
      return;
    }
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
      throw createError(404, "Image was not picked");
    }
    const post = await Post.findById(postId);
    if (!post) {
      throw createError(404, "Could not find ID");
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
    if (err instanceof mongoose.Error.CastError) {
      next(createError(404, "Post ID was not reconized"));
      return;
    }
    next(err);
  }
};

const deletePost = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      throw createError(404, "Failed to find Post with matching ID");
    }
    clearImage([post.imageUrl]);
    const result = await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    if (!user) {
      throw createError(404, "Failed to find User with matching ID");
    }
    user.posts.pull(postId);
    await user.save();
    res.status(200).json({
      message: "Posted Deleted From database",
      postRemoved: result,
    });
  } catch (err: any) {
    if (err instanceof mongoose.Error.CastError) {
      next(createError(404, "Failed to find Post with matching ID"));
      return;
    }
    next(err);
  }
};

export default { getPosts, createPost, updatePost, deletePost };
