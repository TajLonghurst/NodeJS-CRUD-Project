"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = __importDefault(require("../controllers/postController"));
const postValidationSchema_1 = require("../middleware/postValidationSchema");
const Is_Auth_1 = __importDefault(require("../middleware/Is-Auth"));
const routes = express_1.default.Router();
//http://localhost:5000/api/post/
routes.get("/", postController_1.default.getPosts);
//http://localhost:5000/api/post/add
routes.post("/create", Is_Auth_1.default, (0, postValidationSchema_1.postValidationSchema)(postValidationSchema_1.postSchemas.post.create), postController_1.default.createPost);
//http://localhost:5000/api/post/edit/1
routes.put("/update/:postId", Is_Auth_1.default, (0, postValidationSchema_1.postValidationSchema)(postValidationSchema_1.postSchemas.post.update), postController_1.default.updatePost);
//http://localhost:5000/api/post/delete/1
routes.delete("/delete/:postId", Is_Auth_1.default, postController_1.default.deletePost);
exports.default = routes;
