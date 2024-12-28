const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
app.use(cors());
const server = http.createServer(app);


// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins; change this in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow credentials if needed
}));

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(204); // No Content
});

const io = socketIo(server, {
  cors: {
      origin: '*', // Allow all origins for development; restrict in production
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
  },
});

let tasks = []; 

io.on('connection', (socket) => {
  socket.emit('taskUpdated', tasks);
  
  socket.on('addTask', (newTask) => {
    tasks.push(newTask);
    io.emit('taskUpdated', tasks); 
  });

  socket.on('deleteTask', (index) => {
    tasks.splice(index, 1);
    io.emit('taskUpdated', tasks); 
  });

  socket.on('updateTask', ({ index, text }) => {
    if (tasks[index]) {
      tasks[index].text = text;
      io.emit('taskUpdated', tasks); 
    }
  });

  socket.on('completeTask', (index) => {
    if (tasks[index]) {
      tasks[index].completed = !tasks[index].completed;
      io.emit('taskUpdated', tasks); 
    }
  });
});

server.listen(3003, () => {
  console.log(`Server is running on http://localhost:3003/`);
});
