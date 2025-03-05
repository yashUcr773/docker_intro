import express from "express";
import keyValue from "../models/keyValueDB";

const storeRouter = express.Router();
const store: Record<string, string> = {};

storeRouter.get("/", (req, res) => {
  res.status(200).json(store);
  return;
});

storeRouter.post("/", async (req, res) => {
  const body = req.body as { key: string; value: string };
  const { key, value } = body;

  if (!key || !value) {
    res.status(400).send("Key or Value Missing!");
    return;
  }

  try {
    const exists = await keyValue.findOne({ key });

    if (exists) {
      res.status(400).send("Key Exists!");
      return;
    }

    await keyValue.insertOne({ key, value });

    res.status(201).send("Key added Successfully!");
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

storeRouter.get("/:key", async (req, res) => {
  const params = req.params as { key: string };
  const { key } = params;

  if (!key) {
    res.status(400).send("Key Missing!");
    return;
  }

  try {
    const exists = await keyValue.findOne({ key });

    if (exists) {
      res.status(200).json({ key: exists.key, value: exists.value });
      return;
    }

    res.status(404).send("Key not Found!");
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

storeRouter.put("/:key", async (req, res) => {
  const params = req.params as { key: string };
  const { key } = params;

  const body = req.body as { value: string };
  const { value } = body;

  if (!key || !value) {
    res.status(400).send("Key or Value Missing!");
    return;
  }

  try {
    const exists = await keyValue.findOne({ key });

    if (exists) {
      const updated = await keyValue.findOneAndUpdate({ key, value });
      res.status(200).json({ key: updated?.key, value: updated?.value });
      return;
    }

    res.status(404).send("Key not Found!");
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

storeRouter.delete("/:key", async (req, res) => {
  const params = req.params as { key: string };
  const { key } = params;

  if (!key) {
    res.status(400).send("Key Missing!");
    return;
  }

  try {
    const exists = await keyValue.findOne({ key });

    if (exists) {
      const deleted = await keyValue.findOneAndDelete({ key });
      console.log(deleted);
      res.status(204).send("Deleted!");
      return;
    }

    res.status(404).send("Key not Found!");
    return;
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

export default storeRouter;
