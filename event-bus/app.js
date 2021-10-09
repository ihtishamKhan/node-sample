const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT;

app.post('/events', (req, res) => {
    const event = req.body;
    axios.post('http://localhost:3000/events', event);
    axios.post('http://localhost:3001/events', event);
    // axios.post('http://localhost:5500/events', event);

    res.send({ status: 'OK' })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});