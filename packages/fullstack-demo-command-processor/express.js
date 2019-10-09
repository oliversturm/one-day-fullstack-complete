const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { getLogger, getStream } = require('fullstack-demo-logger');
const { createApiHandler } = require('./commands');

const log = getLogger('CmdProc/HTTP');

const runExpress = context => {
  const httpPort = process.env.API_PORT || 3001;

  return new Promise((resolve, reject) => {
    const app = express();
    app.use(cors());
    app.use(morgan('dev', { stream: getStream(log.debug) }));
    app.use(bodyParser.json());

    const processCommand = createApiHandler(context);
    app.post('/api/command', processCommand);

    const server = app.listen(httpPort, '0.0.0.0');
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
