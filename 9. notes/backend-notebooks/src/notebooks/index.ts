import express from "express";
import notebookDB from "../models/notebook";

const notebooksRouter = express.Router();

notebooksRouter.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).send("Name required!");
      return;
    }

    const exists = await notebookDB.findOne({ name });
    if (exists) {
      res.status(400).send("Notebook exists!");
      return;
    }

    const notebook = await notebookDB.insertOne({ name, description });

    res.status(201).json({ message: "Saved!", obj: notebook });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error!" });
    return;
  }
});

notebooksRouter.get("/", async (req, res) => {
  try {
    const notebooks = await notebookDB.find({});
    res.status(201).json({ message: "Notebooks Fetched", notebooks });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

notebooksRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const notebook = await notebookDB.findOne({ _id:id });
    if (notebook) {
      res.status(200).json({ message: "Notebook Found!", notebook });
      return;
    }

    res.status(404).json({ message: "Notebook does not exist" });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error!" });
    return;
  }
});

notebooksRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    const exists = await notebookDB.findOne({ _id:id });
    if (!exists) {
      res.status(404).json({ message: "Notebook does not exist" });
      return;
    }
    const updated = await notebookDB.findOneAndUpdate(
      { _id:id },
      { name, description },
      { returnOriginal: false }
    );

    res.status(200).json({ message: "Notebook updated!", updated });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error!" });
    return;
  }
});

notebooksRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const exists = await notebookDB.findOne({ _id:id });
    if (!exists) {
      res.status(404).json({ message: "Notebook does not exist" });
      return;
    }
    const deleted = await notebookDB.findOneAndDelete({ _id:id });

    res.status(200).json({ message: "Notebook Deleted!", deleted });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error!" });
    return;
  }
});

export default notebooksRouter;
