const chalk = require('chalk');
const log = require('loglevel');
const prefix = require('loglevel-plugin-prefix');
const { Writable } = require('stream');

const colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red
};

prefix.reg(log);
log.setLevel(process.env.LOG_LEVEL || 'info');

prefix.apply(log, {
  format: (level, name, timestamp) =>
    `${chalk.yellow(`[${name.slice(0, 15).padEnd(15)} ${timestamp}]`)} ${colors[
      level.toUpperCase()
    ](level)}:`
});

const getStream = output =>
  new Writable({
    write: (chunk, encoding, callback) => {
      output(chunk.toString().trim());
      callback();
    }
  });

module.exports = { getLogger: log.getLogger, getStream };
