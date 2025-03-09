const express = require("express");
const mongoose = require("mongoose");
const notebookRouter = require("./routes");

require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/notebooks", notebookRouter);

mongoose
  .connect(
    `mongodb://${process.env.MONGODB_HOST}/${process.env.NOTEBOOKS_DB}`,
    {
      auth: {
        username: process.env.NOTEBOOKS_DB_USERNAME,
        password: process.env.NOTEBOOKS_DB_PASSWORD,
      },
      connectTimeoutMS: 500,
    }
  )
  .then(() => {
    console.log("DB connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
    console.log("Error connecting to DB");
  });
