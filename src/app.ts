import express from "express";
import postRoutes from "./routes/postRoute";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", postRoutes);

try {
  const connectDB = async () => {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@nodejs-crud-project.ihi4s8t.mongodb.net/${process.env.MONGODB_DB}`
    );
    app.listen(5000);
    console.log("MongoDB Connnect");
  };
  connectDB();
} catch (err) {
  console.log("MongoDB Connection Failed", err);
}
