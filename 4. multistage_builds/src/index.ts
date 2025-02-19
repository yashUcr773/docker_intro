import express from 'express';

const app = express();
const port = process.env.PORT || 3000;
const version = process.env.VERSION || '1.0.0';

app.get('/', (req, res) => {
    res.send(`Hello World, ${version}`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});