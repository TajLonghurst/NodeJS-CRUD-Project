import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

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
      return next();
    }

    const decodeToken = <jwt.ExtendedJwtPayload>jwt.verify(token, `${process.env.JWT_SECRET}`);

    console.log(decodeToken);

    if (!decodeToken) {
      const error = new Error("Falied to decode Token ");
      throw error;
    }
    req.userId = decodeToken.userId;
    next();
  } catch (err) {
    throw err;
  }
};
