require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Todo = require('./models/Todo'); // Make sure you have this model defined

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = NODE_ENV === 'production' ? process.env.LIVE_PORT : process.env.LOCAL_PORT;
const MONGODB_URI = NODE_ENV === 'production' ? process.env.LIVE_MONGODB_URI : process.env.LOCAL_MONGODB_URI;

app.use(cors());
app.use(express.json());

console.log('Starting server...');
console.log(`Environment: ${NODE_ENV}`);
console.log(`PORT: ${PORT}`);
console.log(`MONGODB_URI: ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Add this line
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Add this to handle connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Add event listeners for connection status
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Todo routes
app.get('/api/todos/:userId', async (req, res) => {
  try {
    console.log('Fetching todos for user:', req.params.userId);
    const todos = await Todo.find({ userId: req.params.userId });
    console.log('Fetched todos:', todos);
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Error fetching todos', error: error.toString() });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    console.log('Received todo data:', req.body);
    const newTodo = new Todo(req.body);
    const savedTodo = await newTodo.save();
    console.log('Created new todo:', savedTodo);
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Error creating todo', error: error.toString() });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  // Logic to update a todo
  console.log('PUT request received for todo:', req.params.id);
  // ... your logic here ...
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    console.log('Deleted todo:', deletedTodo);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Something broke!');
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Try accessing http://localhost:${PORT} in your browser`);
});

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});