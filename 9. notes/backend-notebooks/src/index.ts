import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import notebooksRouter from "./notebooks";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Notebooks server running");
});

app.use("/api/notebooks", notebooksRouter);

app.get("/health", (req, res) => {
  res.status(200).send("Up");
});

mongoose
  .connect(`mongodb://${process.env.MONGODB_HOST}/${process.env.NOTES_DB}`, {
    auth: {
      username: process.env.NOTES_DB_USERNAME,
      password: process.env.NOTES_DB_PASSWORD,
    },
    connectTimeoutMS: 500,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Running on port ${port}`);
    });
  })
  .catch((e) => console.log("Error connecting to DB"));
