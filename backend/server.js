const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3001;
const getProjectsData = () => {
  const possiblePaths = [
    path.resolve(__dirname, '../frontend/src/data/projects.json'),
    path.resolve(__dirname, './projects.json'),
    path.resolve(__dirname, './data/projects.json')
  ];

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        return fs.readFileSync(p, 'utf-8');
      }
    } catch (err) {
      console.error(`Erreur de lecture du JSON à ${p}:`, err);
    }
  }
  return "[]";
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/projects' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(getProjectsData());
    return;
  }

  if (req.url.startsWith('/api/projects/') && req.method === 'GET') {
    const id = req.url.split('/').pop();
    const projects = JSON.parse(getProjectsData());
    const project = projects.find(p => p.id === id);
    if (project) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(project));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "Project not found" }));
    }
    return;
  }

  // Health check endpoint
  if (req.url === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', message: 'Vanilla Node Backend is running' }));
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
