const zeromq = require('zeromq');
const { getLogger } = require('fullstack-demo-logger');

const log = getLogger('ReadMod/EB');

const createEventBus = context => {
  const eventSocketUrl = process.env.EVENT_SOCKET_URL || 'tcp://127.0.0.1:3002';

  let inReplay = false;

  const handleSysMessage = msg => {
    switch (msg.type) {
      case 'SET_REPLAY_STATE':
        inReplay = msg.state;
        break;
    }
  };

  return Promise.resolve(zeromq.socket('sub'))
    .then(socket => {
      socket.on('message', (topic, message) => {
        const topicString = topic.toString();
        const messageString = message.toString();
        log.debug(
          `Received message on topic '${topicString}': ${messageString}`
        );
        const messageObject = JSON.parse(messageString);
        switch (topicString) {
          case 'events':
            return context.projectionHandler.projectEvent(
              messageObject,
              inReplay
            );
          case '__system':
            return handleSysMessage(messageObject);
          default:
            log.warn(`Ignoring message on topic '${topicString}'`);
        }
      });
      return socket;
    })
    .then(socket => {
      socket.connect(eventSocketUrl);
      return socket;
    })
    .catch(err => {
      log.error(`Failed to connect to event bus at ${eventSocketUrl}: ${err}`);
    })
    .then(socket => {
      socket.subscribe('events');
      socket.subscribe('__system');
      return socket;
    })
    .then(socket => {
      log.info(`Event bus connected at ${eventSocketUrl}`);
      return socket;
    });
};

module.exports = { createEventBus };
