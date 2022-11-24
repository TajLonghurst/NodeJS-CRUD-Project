import express from "express";
import postController from "../controllers/postController";
import { postSchemas, postValidationSchema } from "../middleware/postValidationSchema";
import postAuth from "../middleware/Is-Auth";

const routes = express.Router();

//http://localhost:5000/api/post/
routes.get("/", postController.getPosts);

//http://localhost:5000/api/post/add
routes.post(
  "/create",
  postAuth,
  postValidationSchema(postSchemas.post.create),
  postController.createPost
);

//http://localhost:5000/api/post/update/
routes.put(
  "/update/:postId",
  postAuth,
  postValidationSchema(postSchemas.post.update),
  postController.updatePost
);

//http://localhost:5000/api/post/delete/1
routes.delete("/delete/:postId", postAuth, postController.deletePost);

export default routes;
