import express, { ErrorRequestHandler } from "express";
import postRoutes from "./routes/postRoute";
import userRoutes from "./routes/userRoutes";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
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
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json({ message: message });
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
