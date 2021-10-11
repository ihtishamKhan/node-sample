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

    comments.push({ id: commentId, content, status: 'pending' });

    coommentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    });

    res.status(201).send(comments);
});

app.post('/events', async(req, res) => {
    console.log('Received Event:', req.body.type);

    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        const comments = coommentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });
        comment.status === status;

        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        })
    }

    console.log('flow')

    res.send({});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});