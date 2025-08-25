const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const os = require('node:os');

// store original function
const originalNetworkInterfaces = os.networkInterfaces;

test('GET / returns expected network interfaces', async () => {
  const mockData = {
    lo: [
      { address: '127.0.0.1', family: 'IPv4', internal: true }
    ],
    en0: [
      { address: '192.168.0.10', family: 'IPv4', internal: false },
      { address: 'fe80::1', family: 'IPv6', internal: false }
    ],
    wlan0: [
      { address: '10.0.0.5', family: 'IPv4', internal: false }
    ]
  };

  os.networkInterfaces = () => mockData;

  let server;
  try {
    const router = require('../routes/os');
    const app = express();
    app.use('/', router);
    server = app.listen(0);
    const base = `http://localhost:${server.address().port}`;

    const res = await fetch(`${base}/`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.deepStrictEqual(json, [
      { name: 'en0', address: '192.168.0.10' },
      { name: 'wlan0', address: '10.0.0.5' }
    ]);
  } finally {
    if (server) server.close();
    os.networkInterfaces = originalNetworkInterfaces;
  }
});
