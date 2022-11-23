"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    posts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "posts",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("user", userSchema);
