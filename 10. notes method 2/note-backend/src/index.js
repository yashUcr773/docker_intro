const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/api/notes", (req, res) => {
  res.send("Notes server up11!");
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
    console.log("DB connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((e) => {
    console.log(e);
    console.log("Error connecting to DB");
  });
