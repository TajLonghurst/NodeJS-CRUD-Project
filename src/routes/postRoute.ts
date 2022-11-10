import express from "express";
import postController from "../controllers/postController";

const routes = express.Router();

routes.get("/posts", postController.getPosts);

routes.post("/post/add/:postId", postController.addPost);

routes.put("/post/edit/:postId", postController.editPost);

routes.delete("/post/delete/:postId", postController.deletePost);

export default routes;
