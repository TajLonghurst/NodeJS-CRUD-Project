"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("post", postSchema);
