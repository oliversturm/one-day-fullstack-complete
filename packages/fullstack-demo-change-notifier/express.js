const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const createIo = require('socket.io');
const http = require('http');

const { getLogger, getStream } = require('fullstack-demo-logger');
const { createNotifier } = require('./notifier');

const log = getLogger('Changes/HTTP');

const runExpress = () => {
  const httpPort = process.env.API_PORT || 3006;

  return new Promise((resolve, reject) => {
    const app = express();
    app.use(cors());
    app.use(morgan('dev', { stream: getStream(log.debug) }));
    app.use(bodyParser.json());

    const server = http.createServer(app);
    const io = createIo(server);
    const notifier = createNotifier(io);
    app.post('/change', notifier);

    server.listen(httpPort, '0.0.0.0');
    server.on('listening', resolve);
    server.on('error', reject);
  })
    .catch(err => {
      log.error(`Can't run HTTP server: ${err}`);
    })
    .then(() => {
      log.info(`HTTP API listening on port ${httpPort}`);
    });
};

module.exports = { runExpress };
