"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postRoute_1 = __importDefault(require("./routes/postRoute"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const fileStorage = multer_1.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, (0, uuid_1.v4)() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
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
app.use(express_1.default.json());
app.use("images", express_1.default.static(path_1.default.join(__dirname, "images")));
app.use((0, multer_1.default)({ storage: fileStorage, fileFilter: fileFilter }).single("imageUrl"));
app.use(express_1.default.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //Allows to send apis to other domains outsied the same localhost://5000,
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/api/post", postRoute_1.default);
app.use("/api/user", userRoutes_1.default);
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message;
  res.status(status).json({
    error: {
      status: status,
      message: message,
    },
  });
});
mongoose_1.default
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
