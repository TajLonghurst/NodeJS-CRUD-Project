import mongoose, { Schema, model, Document } from "mongoose";

export interface post {
  title: string;
  imageUrl: string;
  content: string;
  creator: string;
}

export interface postModel extends post, Document {}

const postSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<postModel>("post", postSchema);
