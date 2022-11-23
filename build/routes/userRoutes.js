"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const userValidationSchema_1 = require("../middleware/userValidationSchema");
const Is_Auth_1 = __importDefault(require("../middleware/Is-Auth"));
const routes = express_1.default.Router();
//http://localhost:5000/api/user/
routes.get("/", userController_1.default.getUsers);
//http://localhost:5000/api/user/1
routes.get("/:userId", userController_1.default.getSingleUser);
//http://localhost:5000/api/user/login
routes.post("/login", (0, userValidationSchema_1.userValidationSchema)(userValidationSchema_1.userSchemas.user.login), userController_1.default.loginUser);
//http://localhost:5000/api/user/add
routes.post("/create", (0, userValidationSchema_1.userValidationSchema)(userValidationSchema_1.userSchemas.user.create), userController_1.default.createUser);
//http://localhost:5000/api/user/delete/1
routes.delete("/delete/:postId", Is_Auth_1.default, userController_1.default.deleteUser);
exports.default = routes;
