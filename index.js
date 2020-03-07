const http = require('http');
const sIO = require('socket.io');
const fs = require('fs');

class Server {
  constructor(port, host) {

    this._sockets = {};
    this._games = {};
    this._controllers = {};

    this._interval = null;

    this._app = http.createServer((...args) => this._handler(...args));
    this._io = sIO(this._app, {path: '/socket.io/'});

    this._app.listen(port, host);
    this._io.on('connection', (...args) => this._socketConnection(...args));
  }
  _handler(req, res) {
    const file = req.url.slice(1);
    console.log('REQ:', file);
    fs.readFile(file, (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(404);
        res.end('404');
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }
  _socketConnection(socket) {
    console.log('   CONNECT', socket.id);
    this._sockets[socket.id] = socket;

    socket.on('disconnect', (reason) => {
      console.log('DISCONNECT', socket.id, reason);
      delete this._sockets[socket.id];
      delete this._controllers[socket.id];
      delete this._games[socket.id];
    });

    socket.on('identify', (type) => {
      console.log('ID:', type, socket.id);
      switch (type) {
        case 'game':
          this._games[socket.id] = socket;
          break;
        case 'controller':
          this._controllers[socket.id] = socket;
          socket.on('data', (...args) => this._handleNewRotation(...args));
          break;
        default:
          console.error('Unkown ID', type, socket.id);
          break;
      }
    });
  }
  _handleNewRotation(data) {
    console.log('New Data', JSON.stringify(data));
    for (const i in this._games) {
      if (!i) continue;
      const g = this._games[i];
      if (!g || !g.emit) continue;
      g.emit('data', data);
    }
  }
  startRandomData() {
    this._interval = setInterval(() => {
      const now = Date.now();
      const t = now / (2 * Math.PI);
      this._handleNewRotation({
        alpha: 360 * Math.sin(t),
        beta: (360 * Math.sin(t)) - 180,
        gamma: (180 * Math.sin(t)) - 90,
        absolute: true,
      });
    }, 200);
  }
  stopRandomData() {
    clearInterval(this._interval);
  }
  exit() {
    if (this._app) this._app.close();
    if (this._io) this._io.close();
    process.exit(-1);
  }
}

if (require.main === module) {
  console.log('Started via CLI, booting up...');
  const args = process.argv.slice(0);
  const randIndex = args.indexOf('--random-data');
  const rand = randIndex > -1;
  if (rand) args.splice(randIndex, 1);
  const server = new Server(args[2], args[3]);
  if (rand) server.startRandomData();

  process.on('SIGINT', server.exit);
  process.on('SIGTERM', server.exit);
}
module.exports = Server;
