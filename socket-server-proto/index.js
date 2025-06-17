const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { checkStock } = require('./apiContextAdapter');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('check-stock', async (productId) => {
    const inStock = await checkStock(productId);
    socket.emit('stock-status', { productId, inStock });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`runing on.. http://localhost:${PORT}`);
});
