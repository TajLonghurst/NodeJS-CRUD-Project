import express, { Request, Response, NextFunction } from "express";
import Post from "../models/postModel";

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (err) {}
};

const addPost = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (err) {
    res.status(500).json({
      err: err,
    });
    const error = new Error(err as any);
    console.log(error);
  }
};

const editPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (err) {}
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (err) {}
};

export default { getPosts, addPost, editPost, deletePost };
