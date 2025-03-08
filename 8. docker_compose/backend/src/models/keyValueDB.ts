import mongoose from "mongoose";

const keyValueSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

const keyValue = mongoose.model("keyValue", keyValueSchema);

export default keyValue;
