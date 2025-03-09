import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  notebookId: { type: String, required: true },
});

const note = mongoose.model("note", notesSchema);

export default note;
