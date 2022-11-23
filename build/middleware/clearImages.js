"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearImage = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const clearImage = (filePath) => {
  filePath.map((filePath) => {
    filePath = path_1.default.join(__dirname, "../", filePath);
    fs_1.default.unlink(filePath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
};
exports.clearImage = clearImage;
