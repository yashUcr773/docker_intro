import express from 'express';

const storeRouter = express.Router();
const store: Record<string, string> = {};

storeRouter.get('/', (req, res) => {
    res.status(200).json(store);
    return
});

storeRouter.post('/', (req, res) => {
    const body = req.body as { key: string; value: string };
    const { key, value } = body;

    if (!key || !value) {
        res.status(400).send('Key or Value Missing!');
        return
    }

    if (store[key]) {
        res.status(400).send('Key Exists!');
        return
    }

    store[key] = value

    res.status(201).send('Key added Successfully!');
    return

});

storeRouter.get('/:key', (req, res) => {
    const params = req.params as { key: string; };
    const { key } = params;

    if (!key) {
        res.status(400).send('Key Missing!');
        return
    }

    if (store[key]) {
        res.status(200).json({ key, value: store[key] });
        return
    }

    res.status(404).send('Key not Found!');
    return

});

storeRouter.put('/:key', (req, res) => {
    const params = req.params as { key: string; };
    const { key } = params;

    const body = req.body as { value: string; };
    const { value } = body;

    if (!key || !value) {
        res.status(400).send('Key or Value Missing!');
        return
    }

    if (store[key]) {
        store[key] = value
        res.status(200).json({ key, value: store[key] });
        return
    }

    res.status(404).send('Key not Found!');
    return

});

storeRouter.delete('/:key', (req, res) => {
    const params = req.params as { key: string; };
    const { key } = params;

    if (!key) {
        res.status(400).send('Key Missing!');
        return
    }

    if (store[key]) {
        delete store[key]
        res.status(204).send('Deleted!');
        return
    }

    res.status(404).send('Key not Found!');
    return

});

export default storeRouter;