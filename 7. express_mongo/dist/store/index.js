"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const store = {};
app.post('/', (req, res) => {
    const body = req.body;
    const { key, value } = body;
    if (!key || !value) {
        res.status(400).send('Key or Value Missing!');
        return;
    }
    if (store[key]) {
        res.status(400).send('Key Exists!');
        return;
    }
    store[key] = value;
    res.status(201).send('Key added Successfully!');
    return;
});
app.get('/:key', (req, res) => {
    const params = req.params;
    const { key } = params;
    if (!key) {
        res.status(400).send('Key Missing!');
        return;
    }
    if (store[key]) {
        res.status(200).json({ key, value: store[key] });
        return;
    }
    res.status(404).send('Key not Found!');
    return;
});
app.put('/:key', (req, res) => {
    const params = req.params;
    const { key } = params;
    const body = req.body;
    const { value } = body;
    if (!key || !value) {
        res.status(400).send('Key or Value Missing!');
        return;
    }
    if (store[key]) {
        store[key] = value;
        res.status(200).json({ key, value: store[key] });
        return;
    }
    res.status(404).send('Key not Found!');
    return;
});
app.delete('/:key', (req, res) => {
    const params = req.params;
    const { key } = params;
    if (!key) {
        res.status(400).send('Key Missing!');
        return;
    }
    if (store[key]) {
        delete store[key];
        res.status(204);
        return;
    }
    res.status(404).send('Key not Found!');
    return;
});
exports.default = app;
