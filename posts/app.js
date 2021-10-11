const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT;

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async(req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id,
        title
    };
    // https.post('http://localhost:3005/events', { hello: "hello" })
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id,
            title
        }
    });

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Received Event:', req.body.type);

    res.send({});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});