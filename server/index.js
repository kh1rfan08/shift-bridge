const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shifts', require('./routes/shifts'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Serve static files from Vite build
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Init DB then start server
const { initDB } = require('./db');
initDB();

app.listen(PORT, () => {
  console.log(`ShiftBridge server running on port ${PORT}`);
});
