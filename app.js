const express = require('express');
const path = require('path');

const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || '8020'
const { Server } = require("socket.io");
const io = new Server(server);

// explicitly require pug for pkg
require('pug');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// browserify.settings('transform', coffeeify);
// app.get('/javascripts/base.js', browserify(path.join(__dirname, 'src/javascripts/base.coffee')));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

const jsonErrorHandler = (err, req, res, next) => {
  res.status(500).send({ error: err });
}
app.use(jsonErrorHandler);

const rateLimit = require("express-rate-limit")
const limiter = rateLimit({
  windowMs: 1000 / 30,
  max: 1
});
app.use(limiter);

app.get('/', (req, res) => {
  res.render('index');
})

app.post('/api', (req, res) => {
  console.log(req.body);

  io.emit('action', req.body);

  res.sendStatus(200);
});

io.on('connection', (socket) => {
  console.log('user connected');
});

server.listen(port, () => {
  console.log(`Fikmat API test app runs at http://localhost:${port}`);
})
