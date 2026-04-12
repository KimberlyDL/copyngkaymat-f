// backend/src/utils/SSEManager.js
const clients = new Map(); // Map<userId, Set<res>>

const SSEManager = {
  connect(userId, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering if proxied
    res.flushHeaders();

    // Confirm connection is live
    res.write(': connected\n\n');

    // Register connection
    if (!clients.has(userId)) clients.set(userId, new Set());
    clients.get(userId).add(res);

    // Heartbeat every 25s to keep alive through proxies/firewalls
    const hb = setInterval(() => {
      if (res.writableEnded) {
        clearInterval(hb);
        return;
      }
      res.write(': ping\n\n');
    }, 25000);

    // Cleanup is handled entirely inside the 'close' listener — no external
    // disconnect() call is needed. The route just calls SSEManager.connect()
    // and lets this handle the rest.
    res.on('close', () => {
      clearInterval(hb);
      const userConns = clients.get(userId);
      if (userConns) {
        userConns.delete(res);
        if (userConns.size === 0) clients.delete(userId);
      }
    });
  },

  send(userId, data) {
    const userConns = clients.get(userId);
    if (!userConns || userConns.size === 0) return;

    const payload = `data: ${JSON.stringify(data)}\n\n`;
    userConns.forEach((res) => {
      if (!res.writableEnded) res.write(payload);
    });
  },

  sendToMany(userIds, data) {
    userIds.forEach((id) => this.send(id, data));
  },

  isConnected(userId) {
    return (clients.get(userId)?.size ?? 0) > 0;
  }
};

module.exports = SSEManager;