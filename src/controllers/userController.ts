import { Request, Response, NextFunction } from "express";
import { clearImage } from "../middleware/clearImages";
import User from "../models/userModel";
import Post from "../models/postModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import mongoose from "mongoose";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    if (!users) {
      throw createError(404, "Failed to find user");
    }
    res.status(200).json({
      users: users,
    });
  } catch (err: any) {
    if (err instanceof mongoose.Error.CastError) {
      next(createError(404, "Failed to find user"));
      return;
    }
    next(err);
  }
};

const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "Failed to find user");
    }
    res.status(200).json({
      user: user,
    });
  } catch (err: any) {
    if (err instanceof mongoose.Error.CastError) {
      next(createError(404, "Failed to find user"));
      return;
    }
    next(err);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw createError(404, "User with this email could not be found");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw createError(404, "Password decrypt faileds");
    }
    const token = jwt.sign({ email: email, userId: user._id }, `${process.env.JWT_SECRET}`, {
      expiresIn: "1h",
    });
    res.status(200).json({
      token: token,
      userId: user._id.toString(),
    });
  } catch (err: any) {
    if (err instanceof mongoose.Error.CastError) {
      next(createError(404, "Failed to find matching email"));
      return;
    }
    next(err);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, age, email, password } = req.body;
    const doesExsist = await User.findOne({ email: email.toLowerCase() });
    if (doesExsist) {
      throw createError(409, "Email already exsits");
    }
    const hashPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: name,
      age: age,
      email: email.toLowerCase(),
      password: hashPassword,
    });
    const createdUser = await user.save();
    res.status(201).json({
      message: "Created Succsefully",
      user: createdUser,
    });
  } catch (err: any) {
    if (err instanceof mongoose.Error.CastError) {
      next(createError(404, "Failed to create user"));
      return;
    }
    next(err);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.postId;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Failed to find User with matching Id");
      throw error;
    }

    const userPostIds = [...user.posts];

    const userPosts = await Post.find({ _id: { $in: userPostIds } });

    if (!userPosts) {
      throw createError(404, "Failed to find Posts with matching IDs");
    }

    const images = userPosts.map((img) => {
      return img.imageUrl;
    });

    clearImage(images);

    const posts = await Post.deleteMany({
      _id: { $in: userPostIds },
    });

    if (!posts) {
      throw createError(404, "Failed to delete posts with matching user ID");
    }

    const result = await User.findByIdAndRemove(userId);
    res.status(200).json({
      message: "User succsfully deleted From database",
      userRemoved: result,
      postsRemoved: posts,
    });
  } catch (err: any) {
    if (err instanceof mongoose.Error.CastError) {
      next(createError(404, "Failed to delete user"));
      return;
    }
    next(err);
  }
};

export default { getUsers, getSingleUser, createUser, deleteUser, loginUser };
