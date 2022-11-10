import express from "express";
import postController from "../controllers/postController";

const routes = express.Router();

//http://localhost:5000/api/post/
routes.get("/", postController.getPosts);

//http://localhost:5000/api/post/add
routes.post("/create", postController.createPost);

//http://localhost:5000/api/post/edit/1
routes.put("/update/:postId", postController.updatePost);

//http://localhost:5000/api/post/delete/1
routes.delete("/delete/:postId", postController.deletePost);

export default routes;
