import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import storeRouter from "./store";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Server Running!");
});

app.use("/store", storeRouter);

app.get("/health", (req, res) => {
  res.status(200).send("Up");
});

mongoose
  .connect(`mongodb://mongodb/${process.env.KEY_VALUE_DB}`, {
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
