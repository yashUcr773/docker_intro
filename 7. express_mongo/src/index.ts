import express from 'express';
import store from './store';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('SErver Running');
});

app.use('/store', store)

app.get('/health', (req, res) => {
    res.status(200).send('Up');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});