const express = require('express');
const fs = require('fs');

const app = express()
const portNumber = 80; // http port

app.get('/budget', (req, res) => {
    console.log("Budget Page reached");
    fs.createReadStream("./pages/budget.html").pipe(res);
});

app.get('/budget.js', (req, res) => {
    console.log("Budget JS Page reached");
    fs.createReadStream("./scripts/budget.js").pipe(res);
});

app.post('/budget', (req, res) => {
    console.log("Budget Page SETTING reached");
    res.end()
});

app.listen(portNumber, () => {
    console.log(`Starting listening on port ${portNumber}`)
})
