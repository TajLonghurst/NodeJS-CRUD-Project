import express from "express";
import userController from "../controllers/userController";

const routes = express.Router();

//http://localhost:5000/api/user/
routes.get("/", userController.getUsers);

//http://localhost:5000/api/user/1
routes.get("/:userId", userController.getSingleUsers);

//http://localhost:5000/api/user/add
routes.post("/create", userController.createUser);

//http://localhost:5000/api/user/delete/1
routes.delete("/delete/:postId", userController.deleteUser);

export default routes;
