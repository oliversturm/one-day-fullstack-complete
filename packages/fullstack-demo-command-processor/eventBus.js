const zeromq = require('zeromq');
const { getLogger } = require('fullstack-demo-logger');

const log = getLogger('CmdProc/EB');

// For all kinds of reasons (http://zguide.zeromq.org/page:all),
// zeromq pub/sub subscribers can be running behind the publisher
// a bit. This can happen when the subscriber is already running
// before the publisher, but even if it is started shortly after
// the publisher. Of course there are ways to resolve this and
// sync things up "properly", but using zeromq in this sample
// solution is only a suggestion and the issues and solutions
// would be very different with other messaging systems, so I'm
// choosing the simple workaround of a small built-in startup
// delay for now.
const waitSubscribers = millis => (...args) =>
  new Promise(resolve => {
    log.debug('Waiting for subscribers to catch up');
    setTimeout(() => resolve(...args), millis);
  });

const createEventBus = () => {
  const eventBusPort = process.env.EVENT_BUS_PORT || 3002;

  return new Promise(resolve => {
    const socket = zeromq.socket('pub');
    socket.bind(`tcp://*:${eventBusPort}`, err => {
      if (err) throw new Error(err);
      resolve(socket);
    });
  })
    .catch(err => {
      log.error(`Failed to create event bus on port ${eventBusPort}: ${err}`);
    })
    .then(waitSubscribers(1000))
    .then(socket => {
      log.info(`Event bus publishing to port ${eventBusPort}`);
      return socket;
    })
    .then(socket => ({
      publishEvent: event => {
        log.debug(`Publishing event timestamp ${event.timestamp}`);
        socket.send(['events', JSON.stringify(event)]);
        return event;
      },
      publishReplayState: state => {
        log.debug(`Publishing replay state ${state}`);
        socket.send([
          '__system',
          JSON.stringify({ type: 'SET_REPLAY_STATE', state })
        ]);
        return state;
      }
    }));
};

module.exports = { createEventBus };
