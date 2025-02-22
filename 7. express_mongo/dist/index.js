"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const store_1 = __importDefault(require("./store"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.status(200).send('SErver Running');
});
app.use('/store', store_1.default);
app.get('/health', (req, res) => {
    res.status(200).send('Up');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
