import express from "express";
import postRoutes from "./routes/postRoute";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //Allows to send apis to other domains outsied the same localhost://3000,
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/post", postRoutes);

try {
  const connectDB = async () => {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@nodejs-crud-project.ihi4s8t.mongodb.net/${process.env.MONGODB_DB}`
    );
    app.listen(process.env.PORT || 5000);
    console.log("MongoDB Connnect");
  };
  connectDB();
} catch (err) {
  console.log("MongoDB Connection Failed", err);
}
