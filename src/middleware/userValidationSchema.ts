import Joi, { ObjectSchema } from "joi";
import { NextFunction, Response, Request } from "express";
import { user } from "../models/userModel";

export const userValidationSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (err) {
      return res.status(422).json({ err });
    }
  };
};

export const userSchemas = {
  user: {
    create: Joi.object<user>({
      name: Joi.string().required().messages({
        "string.base": `"Name" should be a type of 'Charaters'`,
        "string.empty": `"Name" cannot be an empty field`,
        "any.required": `"Name" is a required field`,
      }),
      age: Joi.number().required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "nz"] } })
        .required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,}$")).required(),
    }),
    login: Joi.object<user>({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "nz"] } })
        .required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,}$")).required(),
    }),
  },
};
