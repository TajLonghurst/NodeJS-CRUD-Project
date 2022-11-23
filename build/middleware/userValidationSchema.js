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
exports.userSchemas = exports.userValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const userValidationSchema = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema.validateAsync(req.body);
            next();
        }
        catch (err) {
            return res.status(422).json({ err });
        }
    });
};
exports.userValidationSchema = userValidationSchema;
exports.userSchemas = {
    user: {
        create: joi_1.default.object({
            name: joi_1.default.string().required(),
            age: joi_1.default.number().required(),
            email: joi_1.default.string()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "nz"] } })
                .lowercase()
                .required(),
            password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{6,}$")).required().messages({
                "string.pattern.base": `password should should have 6 or more characters`,
            }),
        }),
        login: joi_1.default.object({
            email: joi_1.default.string()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "nz"] } })
                .lowercase()
                .required(),
            password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{6,}$")).required().messages({
                "string.pattern.base": `password should should have 6 or more characters`,
            }),
        }),
    },
};
