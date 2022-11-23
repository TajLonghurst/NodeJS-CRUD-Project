import express, { Request, ErrorRequestHandler } from "express";
import postRoutes from "./routes/postRoute";
import userRoutes from "./routes/userRoutes";
import mongoose from "mongoose";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png .jpg and jpeg images allowed"));
  }
};

app.use(express.json());
app.use("images", express.static(path.join(__dirname, "images")));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("imageUrl"));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //Allows to send apis to other domains outsied the same localhost://5000,
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);

app.use(((err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message;
  res.status(status).json({
    error: {
      status: status,
      message: message,
    },
  });
}) as ErrorRequestHandler);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@nodejs-crud-project.ihi4s8t.mongodb.net/${process.env.MONGODB_DB}`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log("MongoDB Connnect");
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed", err);
  });
