const express = require('express')
const path = require('path')
const http = require('http');
const socketIo = require('socket.io');

const app = express()
const port = 3000
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('dist'));


app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../index.html'))
})

io.on('connection', (socket) => {
  console.log('a user connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Add more event listeners as needed
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})