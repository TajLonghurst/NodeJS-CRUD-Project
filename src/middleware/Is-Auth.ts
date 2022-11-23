import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export interface ExtendedRequest extends Request {
  userId?: string | JwtPayload;
}

declare module "jsonwebtoken" {
  interface ExtendedJwtPayload extends JwtPayload {
    userId: string;
    email: string;
  }
}

export default async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  //gets the jwt token and splits the string speartaing the bearer text. As well as it has a ? because Authorization isn't always required
  try {
    // const token = req.get("Authorization")?.split(" ")[1];
    const token = req.get("Authorization")?.replace(/^Bearer\s/, "");

    if (!token) {
      throw createError(400, "failed to find Bearer token");
    }

    const decodeToken = <jwt.ExtendedJwtPayload>jwt.verify(token, `${process.env.JWT_SECRET}`);

    console.log("decode Token", decodeToken);

    if (!decodeToken) {
      throw createError(401, "Falied to decode Token");
    }
    req.userId = decodeToken.userId;
    next();
  } catch (err) {
    next(err);
  }
};
