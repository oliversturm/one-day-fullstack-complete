const jsonic = require('jsonic');
const fetch = require('isomorphic-fetch');
const { highlight } = require('cardinal');
const chalk = require('chalk');

const [method, url, ...rest] = process.argv.slice(2);
const body =
  method === 'POST'
    ? JSON.stringify(jsonic(Array.isArray(rest) ? rest.join(' ') : rest))
    : undefined;

const formatResHeaders = ({ headers: { _headers } }) => `${chalk.magenta(
  'Date: '
)} ${_headers.date[0]}
${chalk.magenta('Content-Type: ')} ${_headers['content-type'][0]}
${chalk.magenta('Content-Length: ')} ${_headers['content-length'][0]}`;
const formatStatus = ({ status, statusText }) =>
  `${chalk.cyan(status)} - ${chalk.yellow(statusText)}`;

fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body })
  .then(res => {
    if (!res.ok) {
      console.error(`${chalk.red('HTTP ERROR: ')} ${formatStatus(res)}

${formatResHeaders(res)}`);
      process.exit(0);
    }
    return res;
  })
  .catch(err => {
    console.error(`${chalk.red('FETCH ERROR: ')}: ${err}`);
    process.exit(0);
  })
  .then(res => {
    console.log(`${formatStatus(res)}

${formatResHeaders(res)}`);
    return res;
  })
  .then(res => {
    if (res.status !== 204 && res.headers._headers['content-length'][0] > 0) {
      if (
        res.headers._headers['content-type'][0]
          .toLowerCase()
          .startsWith('application/json')
      )
        // we convert back and forth to be sure things are valid
        return res
          .json()
          .then(json => JSON.stringify(json, null, 2))
          .then(text => highlight(text));
      else return res.text();
    }
  })
  .then(text => {
    if (text)
      console.log(`
${text}`);
  });
