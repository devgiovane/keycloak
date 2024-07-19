import express from 'express';

const app = express();

app.get('/health', function(req, res) {
    res.send('Hi there!');
});

app.listen(3000, function() {
    console.log('Listem on port 3000!');
});