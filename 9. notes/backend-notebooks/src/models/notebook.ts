import mongoose from "mongoose";

const notebooksSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

const notebook = mongoose.model("notebook", notebooksSchema);

export default notebook;
