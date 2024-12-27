const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let tasks = []; // Your tasks array

// Serve a simple HTML file (optional)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Ensure you have an index.html file to serve
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  
  // Send current tasks to new clients
  socket.emit('taskUpdated', tasks);
  
  // Handle adding a new task
  socket.on('addTask', (newTask) => {
    tasks.push(newTask);
    io.emit('taskUpdated', tasks); // Notify all clients about the updated tasks
  });

  // Handle deleting a task
  socket.on('deleteTask', (index) => {
    tasks.splice(index, 1);
    io.emit('taskUpdated', tasks); // Notify all clients about the updated tasks
  });

  // Handle updating a task
  socket.on('updateTask', ({ index, text }) => {
    if (tasks[index]) {
      tasks[index].text = text;
      io.emit('taskUpdated', tasks); // Notify all clients about the updated tasks
    }
  });

  // Handle completing a task
  socket.on('completeTask', (index) => {
    if (tasks[index]) {
      tasks[index].completed = !tasks[index].completed;
      io.emit('taskUpdated', tasks); // Notify all clients about the updated tasks
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
