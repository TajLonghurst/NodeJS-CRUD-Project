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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //gets the jwt token and splits the string speartaing the bearer text. As well as it has a ? because Authorization isn't always required
    try {
        // const token = req.get("Authorization")?.split(" ")[1];
        const token = (_a = req.get("Authorization")) === null || _a === void 0 ? void 0 : _a.replace(/^Bearer\s/, "");
        if (!token) {
            throw (0, http_errors_1.default)(400, "failed to find Bearer token");
        }
        const decodeToken = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
        console.log("decode Token", decodeToken);
        if (!decodeToken) {
            throw (0, http_errors_1.default)(401, "Falied to decode Token");
        }
        req.userId = decodeToken.userId;
        next();
    }
    catch (err) {
        next(err);
    }
});
