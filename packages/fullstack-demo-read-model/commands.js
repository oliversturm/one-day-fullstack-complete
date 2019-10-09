const fetch = require('isomorphic-fetch');

const { getLogger } = require('fullstack-demo-logger');

const log = getLogger('ReadMod/Cmd');

const postCommand = (endpoint, content) =>
  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content)
  }).then(res => {
    if (!res.ok) {
      throw new Error(`Fetch error: ${res.status}/${res.statusText}`);
    }
    return res;
  });

const createCommandHandler = () =>
  Promise.resolve({
    execute: cmd =>
      new Promise(resolve => {
        log.debug(`Executing command ${JSON.stringify(cmd)}`);
        resolve();
      })
        .then(() => postCommand(process.env.COMMAND_ENDPOINT, cmd))
        .catch(err => {
          log.error(`Can't execute command ${JSON.stringify(cmd)}: ${err}`);
        })
  });

module.exports = { createCommandHandler };
