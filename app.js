const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || '8020'
const { Server } = require("socket.io");
const io = new Server(server);

// explicitly require pug for pkg
require('pug');

app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
})

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
});

server.listen(port, () => {
  console.log(`Fikmat API test app runs at http://localhost:${port}`);
})
