#!/usr/bin/env node

/**
 * Simple HTTP File Server
 * Provides temporary URLs for file downloads
 */

import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { basename } from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    port: { type: "string", default: "8888" },
    file: { type: "string" },
    bind: { type: "string", default: "0.0.0.0" },
  },
});

const PORT = parseInt(values.port);
const BIND = values.bind;
const servedFiles = new Map();

// Add file to serve
if (values.file && existsSync(values.file)) {
  const fileStats = statSync(values.file);
  const fileId = Math.random().toString(36).substring(2, 10);
  servedFiles.set(fileId, {
    path: values.file,
    name: basename(values.file),
    size: fileStats.size,
    createdAt: Date.now(),
  });

  console.log(JSON.stringify({
    success: true,
    url: `http://${BIND === '0.0.0.0' ? '127.0.0.1' : BIND}:${PORT}/download/${fileId}/${basename(values.file)}`,
    file_id: fileId,
    file_name: basename(values.file),
    file_size: fileStats.size,
    message: "File server started. URL is valid while server is running.",
  }, null, 2));
}

const server = createServer((req, res) => {
  // Parse URL
  const urlMatch = req.url.match(/^\/download\/([a-z0-9]+)\/(.*)/);

  if (!urlMatch) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found\n');
    return;
  }

  const fileId = urlMatch[1];
  const fileInfo = servedFiles.get(fileId);

  if (!fileInfo) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found or expired\n');
    return;
  }

  if (!existsSync(fileInfo.path)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File no longer exists\n');
    return;
  }

  // Serve the file
  res.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${fileInfo.name}"`,
    'Content-Length': fileInfo.size,
  });

  const fileStream = createReadStream(fileInfo.path);
  fileStream.pipe(res);

  fileStream.on('error', (error) => {
    console.error(`Error serving file: ${error.message}`);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
    }
    res.end('Internal Server Error\n');
  });
});

server.listen(PORT, BIND, () => {
  console.error(`[Server] Listening on http://${BIND}:${PORT}`);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.error('\n[Server] Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.error('\n[Server] Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
