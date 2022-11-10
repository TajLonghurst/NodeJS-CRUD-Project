import mongoose, { Schema, model, Document } from "mongoose";

export interface user {
  name: string;
  age: number;
  email: string;
  password: string;
  posts: [];
}

export interface userModel extends user, Document {}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
  },
  { timestamps: true }
);

export default model<userModel>("user", userSchema);
