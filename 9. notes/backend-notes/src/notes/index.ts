import express from "express";
import noteDB from "../models/note";

const notesRouter = express.Router();

notesRouter.post("/", async (req, res) => {
  try {
    const { title, content, notebookId } = req.body;

    if (!title || !content) {
      res.status(400).send("Title and Content are required!");
      return;
    }

    if (!notebookId) {
      res.status(404).send("Notebook Id is required!");
      return;
    }

    const notebook = await noteDB.insertOne({ title, content, notebookId });

    res.status(201).json({ message: "Saved!", obj: notebook });
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error!" });
    return;
  }
});

notesRouter.get("/", async (req, res) => {
  try {
    const notebooks = await notebookDB.find({});
    res.status(201).json({ message: "Notebooks Fetched", notebooks });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

notesRouter.get("/:id", async (req, res) => {
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

notesRouter.put("/:id", async (req, res) => {
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

notesRouter.delete("/:id", async (req, res) => {
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

export default notesRouter;
