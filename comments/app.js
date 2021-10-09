const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT;

const coommentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(coommentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async(req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = coommentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content });

    coommentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:3005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id
        }
    });

    res.status(201).send(comments);
});

app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);

    res.send({});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});