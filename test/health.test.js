const { test } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { app } = require('../app');

function getJson(server, path) {
  const { port } = server.address();
  return new Promise((resolve, reject) => {
    http.get({ port, path }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: JSON.parse(body || '{}') });
      });
    }).on('error', reject);
  });
}

test('GET /health returns 200 ok', async () => {
  const server = app.listen(0);
  try {
    const res = await getJson(server, '/health');
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.body, { status: 'ok' });
  } finally {
    server.close();
  }
});
