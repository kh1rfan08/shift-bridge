const http = require('http');
const path = require('path');

const PORT = 3000;

function dashboardPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shift Bridge</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .container {
      text-align: center;
      padding: 2rem;
      max-width: 600px;
    }

    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 2rem;
      background: linear-gradient(135deg, #0ea5e9, #06b6d4);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: 1.1rem;
      color: #94a3b8;
      margin-bottom: 2.5rem;
    }

    .status-card {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      backdrop-filter: blur(10px);
    }

    .status-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
    }

    .status-row + .status-row {
      border-top: 1px solid rgba(59, 130, 246, 0.1);
    }

    .status-label {
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .status-value {
      font-weight: 600;
      color: #e2e8f0;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-badge.online {
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
    }

    .status-badge.online::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4ade80;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .footer {
      margin-top: 2rem;
      color: #475569;
      font-size: 0.85rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">&#9877;</div>
    <h1>Shift Bridge</h1>
    <p class="subtitle">Dashboard — Coming Soon</p>

    <div class="status-card">
      <div class="status-row">
        <span class="status-label">Service</span>
        <span class="status-badge online">Online</span>
      </div>
      <div class="status-row">
        <span class="status-label">Version</span>
        <span class="status-value">0.1.0</span>
      </div>
      <div class="status-row">
        <span class="status-label">Environment</span>
        <span class="status-value">Production</span>
      </div>
    </div>

    <p class="footer">shift-bridge.srv1403391.hstgr.cloud</p>
  </div>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(dashboardPage());
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Shift Bridge server running on port ${PORT}`);
});
