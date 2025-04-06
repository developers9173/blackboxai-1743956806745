require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { initSocket } = require('./services/socketService');

// Import routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Database connection
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./chat.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT, content TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
  console.log('SQLite database initialized');
});

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Initialize Socket.IO
initSocket(server);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Serve views with titles
app.get('/', (req, res) => res.render('chat/chat', { title: 'Chat Application' }));
app.get('/login', (req, res) => res.render('auth/login', { title: 'Login' }));
app.get('/register', (req, res) => res.render('auth/register', { title: 'Register' }));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
