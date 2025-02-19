const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const users = [];

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/users', (req, res) => {
    const userId = req.body.userId;

    if (!userId) {
        return res.status(400).send('Bad Request');
    }

    
    if (users.includes(userId)) {
        return res.status(409).send('Conflict');
    }

    users.push(userId);
    return res.status(201).send('Data added successfully');
});

app.get('/users', (req, res) => {
    res.json({ users });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});