"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postModel_1 = __importDefault(require("../models/postModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const clearImages_1 = require("../middleware/clearImages");
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find();
        if (!posts) {
            throw (0, http_errors_1.default)(404, "Failed to find posts");
        }
        res.status(200).json({
            posts: posts,
        });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(404, "Failed to find posts"));
            return;
        }
        next(err);
    }
});
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const imageUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path.replace("\\", "/");
        if (!imageUrl) {
            throw (0, http_errors_1.default)(404, "Could not find file");
        }
        const { title, content, creator: userId } = req.body;
        const post = new postModel_1.default({
            title: title,
            imageUrl: imageUrl,
            content: content,
            creator: userId,
        });
        const createdPost = yield post.save();
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            throw (0, http_errors_1.default)(404, "Could not find user");
        }
        user.posts.push(post);
        yield user.save();
        res.status(201).json({
            post: createdPost,
        });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(404, "could not create post"));
            return;
        }
        next(err);
    }
});
const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.postId;
        const { title, content, creator } = req.body;
        let imageUrl = req.body.imageUrl;
        if (req.file) {
            imageUrl = req.file.path;
        }
        if (!imageUrl) {
            throw (0, http_errors_1.default)(404, "Image was not picked");
        }
        const post = yield postModel_1.default.findById(postId);
        if (!post) {
            throw (0, http_errors_1.default)(404, "Could not find ID");
        }
        if (imageUrl !== post.imageUrl) {
            (0, clearImages_1.clearImage)([post.imageUrl]);
        }
        post.set({
            title: title,
            imageUrl: imageUrl,
            content: content,
            creator: creator,
        });
        const updatedPost = yield post.save();
        res.status(200).json({
            post: updatedPost,
        });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(404, "Post ID was not reconized"));
            return;
        }
        next(err);
    }
});
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.postId;
        const post = yield postModel_1.default.findById(postId);
        if (!post) {
            throw (0, http_errors_1.default)(404, "Failed to find Post with matching ID");
        }
        (0, clearImages_1.clearImage)([post.imageUrl]);
        const result = yield postModel_1.default.findByIdAndRemove(postId);
        const user = yield userModel_1.default.findById(req.userId);
        if (!user) {
            throw (0, http_errors_1.default)(404, "Failed to find User with matching ID");
        }
        user.posts.pull(postId);
        yield user.save();
        res.status(200).json({
            message: "Posted Deleted From database",
            postRemoved: result,
        });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(404, "Failed to find Post with matching ID"));
            return;
        }
        next(err);
    }
});
exports.default = { getPosts, createPost, updatePost, deletePost };
