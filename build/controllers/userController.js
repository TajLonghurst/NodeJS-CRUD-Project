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
const clearImages_1 = require("../middleware/clearImages");
const userModel_1 = __importDefault(require("../models/userModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        if (!users) {
            throw (0, http_errors_1.default)(404, "Failed to find user");
        }
        res.status(200).json({
            users: users,
        });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(404, "Failed to find user"));
            return;
        }
        next(err);
    }
});
const getSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            throw (0, http_errors_1.default)(404, "Failed to find user");
        }
        res.status(200).json({
            user: user,
        });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(404, "Failed to find user"));
            return;
        }
        next(err);
    }
});
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw (0, http_errors_1.default)(404, "User with this email could not be found");
        }
        const isEqual = yield bcrypt_1.default.compare(password, user.password);
        if (!isEqual) {
            throw (0, http_errors_1.default)(404, "Password decrypt faileds");
        }
        const token = jsonwebtoken_1.default.sign({ email: email, userId: user._id }, `${process.env.JWT_SECRET}`, {
            expiresIn: "1h",
        });
        res.status(200).json({
            token: token,
            userId: user._id.toString(),
        });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(404, "Failed to find matching email"));
            return;
        }
        next(err);
    }
});
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, age, email, password } = req.body;
        const doesExsist = yield userModel_1.default.findOne({ email: email.toLowerCase() });
        if (doesExsist) {
            throw (0, http_errors_1.default)(409, "Email already exsits");
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 12);
        const user = new userModel_1.default({
            name: name,
            age: age,
            email: email.toLowerCase(),
            password: hashPassword,
        });
        const createdUser = yield user.save();
        res.status(201).json({
            message: "Created Succsefully",
            user: createdUser,
        });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(404, "Failed to create user"));
            return;
        }
        next(err);
    }
});
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.postId;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            const error = new Error("Failed to find User with matching Id");
            throw error;
        }
        const userPostIds = [...user.posts];
        const userPosts = yield postModel_1.default.find({ _id: { $in: userPostIds } });
        if (!userPosts) {
            throw (0, http_errors_1.default)(404, "Failed to find Posts with matching IDs");
        }
        const images = userPosts.map((img) => {
            return img.imageUrl;
        });
        (0, clearImages_1.clearImage)(images);
        const posts = yield postModel_1.default.deleteMany({
            _id: { $in: userPostIds },
        });
        if (!posts) {
            throw (0, http_errors_1.default)(404, "Failed to delete posts with matching user ID");
        }
        const result = yield userModel_1.default.findByIdAndRemove(userId);
        res.status(200).json({
            message: "User succsfully deleted From database",
            userRemoved: result,
            postsRemoved: posts,
        });
    }
    catch (err) {
        if (err instanceof mongoose_1.default.Error.CastError) {
            next((0, http_errors_1.default)(404, "Failed to delete user"));
            return;
        }
        next(err);
    }
});
exports.default = { getUsers, getSingleUser, createUser, deleteUser, loginUser };
