const Queue = require('promise-queue');
const fetch = require('isomorphic-fetch');

const { getLogger } = require('fullstack-demo-logger');

const log = getLogger('ReadMod/Chng');

const sendChangeNotification = (endpoint, content) =>
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

const createChangeNotificationHandler = () => {
  const queue = new Queue(1, Infinity);

  return Promise.resolve({
    sendChangeNotification: changeInfo =>
      queue.add(() =>
        new Promise(resolve => {
          log.debug(
            `Sending change notification ${JSON.stringify(changeInfo)}'`
          );
          resolve();
        })
          .then(
            sendChangeNotification(
              process.env.CHANGE_NOTIFIER_ENDPOINT,
              changeInfo
            )
          )
          .catch(err => {
            log.error(
              `Can't send change notification ${JSON.stringify(
                changeInfo
              )}: ${err}`
            );
          })
      ),
    createChangeInfo: (
      endpointName,
      readModelName,
      resolverName,
      changeKind,
      details
    ) => {
      if (!['all', 'addRow', 'updateRow', 'deleteRow'].includes(changeKind))
        throw new Error(`Invalid changeKind ${changeKind}`);
      return { endpointName, readModelName, resolverName, changeKind, details };
    }
  });
};

module.exports = { createChangeNotificationHandler };
