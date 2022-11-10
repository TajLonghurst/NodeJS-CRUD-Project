import express from "express";
import postController from "../controllers/postController";

const routes = express.Router();

routes.get("/", postController.getPosts);

routes.post("/add", postController.addPost);

routes.put("/edit/:postId", postController.editPost);

routes.delete("/delete/:postId", postController.deletePost);

export default routes;
