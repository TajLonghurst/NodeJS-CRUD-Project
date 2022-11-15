import express from "express";
import userController from "../controllers/userController";
import { userSchemas, userValidationSchema } from "../middleware/userValidationSchema";
import postAuth from "../middleware/Is-Auth";

const routes = express.Router();

//http://localhost:5000/api/user/
routes.get("/", userController.getUsers);

//http://localhost:5000/api/user/1
routes.get("/:userId", userController.getSingleUser);

//http://localhost:5000/api/user/login
routes.post("/login", userValidationSchema(userSchemas.user.login), userController.loginUser);

//http://localhost:5000/api/user/add
routes.post("/create", userValidationSchema(userSchemas.user.create), userController.createUser);

//http://localhost:5000/api/user/delete/1
routes.delete("/delete/:postId", postAuth, userController.deleteUser);

export default routes;
