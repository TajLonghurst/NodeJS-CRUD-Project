import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export = async (req: Request, res: Response, next: NextFunction) => {
  //gets the jwt token and splits the string speartaing the bearer text. As well as it has a ? because Authorization isn't always required
  try {
    // const token = req.get("Authorization")?.split(" ")[1];
    const token = req.get("Authorization")?.replace(/^Bearer\s/, "");

    if (!token) {
      return next();
    }

    const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`);

    if (!decodedToken) {
      const error = new Error("Falied to decode Token ");
      throw error;
    }
    req.userId = decodedToken;
  } catch (err) {
    throw err;
  }
};
