import Joi, { ObjectSchema } from "joi";
import { NextFunction, Response, Request } from "express";
import { post } from "../models/postModel";

export const postValidationSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (err) {
      return res.status(422).json({ err });
    }
  };
};

export const postSchemas = {
  post: {
    create: Joi.object<post>({
      title: Joi.string().required(),
      imageUrl: Joi.string().required(),
      content: Joi.string().required(),
      creator: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
    update: Joi.object<post>({
      title: Joi.string().required(),
      imageUrl: Joi.string().required(),
      content: Joi.string().required(),
      creator: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
};
