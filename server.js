const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const cors = require('cors');


//for solving cors error on console
app.use(cors({
    origin: 'https://internship-task-omega.vercel.app/', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));

app.use(cors({
    origin: 'https://internship-task-backend-mfy7.onrender.com/', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));

let tasks = []; 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); 
});

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

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
