const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello from Express!')
});

app.listen(3001, () => {
    console.log('Express server listening on port 3001')
});