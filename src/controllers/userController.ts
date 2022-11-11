import { Request, Response, NextFunction } from "express";
import User, { userModel } from "../models/userModel";
import jwt from "jsonwebtoken";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    if (!users) {
      const error = new Error("Could not find users");
      throw error;
    }
    res.status(200).json({
      users: users,
    });
  } catch (err: any) {
    err.message = "Failed to find users";
    err.statusCode = 404;
    next(err);
  }
};

const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Could not find user");
      throw error;
    }
    res.status(200).json({
      user: user,
    });
  } catch (err: any) {
    err.message = "Failed to find user";
    err.statusCode = 404;
    next(err);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const error = new Error("User with this email could not be found");
      throw error;
    }
    if (password !== user.password) {
      const error = new Error("User with this password is incorrect");
      throw error;
    }
    const token = jwt.sign({ email: email, userId: user._id }, `${process.env.JWT_SECRET}`, {
      expiresIn: "1h",
    });
    res.status(200).json({
      token: token,
      userId: user._id.toString(),
    });
  } catch (err: any) {
    err.message = "Failed to find matching email";
    err.statusCode = 404;
    next(err);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, age, email, password } = req.body;
    const user = new User({
      name: name,
      age: age,
      email: email,
      password: password,
    });
    const createdUser = await user.save();
    res.status(201).json({
      user: createdUser,
    });
  } catch (err: any) {
    err.message = "Failed to Create User";
    err.statusCode = 404;
    next(err);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.postId;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Failed to find Post with matching Id");
      throw error;
    }
    const result = await User.findByIdAndRemove(userId);
    res.status(200).json({
      message: "User Deleted From database",
      userRemoved: result,
    });
  } catch (err: any) {
    err.message = "Failed to find User with matching ID";
    err.statusCode = 404;
    next(err);
  }
};

export default { getUsers, getSingleUser, createUser, deleteUser, loginUser };
