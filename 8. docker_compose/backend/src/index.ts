import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import storeRouter from "./store";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Server Running112222!");
});

app.use("/store", storeRouter);

app.get("/health", (req, res) => {
  res.status(200).send("U2211p211");
});

mongoose
  .connect(`mongodb://${process.env.MONGODB_HOST}/${process.env.KEY_VALUE_DB}`, {
    auth: {
      username: process.env.KEY_VALUE_USER,
      password: process.env.KEY_VALUE_PASSWORD,
    },
    connectTimeoutMS: 500,
  })
  .then(() => {
    console.log("connected to db");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((e) => console.log("error connecting to DB", e));
