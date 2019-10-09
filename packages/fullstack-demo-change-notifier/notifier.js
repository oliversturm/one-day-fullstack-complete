const { getLogger } = require('fullstack-demo-logger');

const ioLog = getLogger('Changes/IO');
const rmLog = getLogger('Changes/RM');

const getRoomName = (endpointName, readModelName, resolverName) =>
  `${endpointName}/${readModelName}/${resolverName}`;

const createNotifier = io => {
  io.on('connect', socket => {
    ioLog.debug(
      `Connection: ${socket.id} (handshake: ${JSON.stringify(
        socket.handshake
      )})`
    );

    socket.on('disconnect', reason => {
      ioLog.debug(`Disconnected ${socket.id}, reason: ${reason}`);
    });

    socket.on('error', error => {
      ioLog.debug(`Communication error with ${socket.id}: ${error}`);
    });

    socket.on('register', resolvers => {
      try {
        socket.join(
          resolvers.map(({ endpointName, readModelName, resolverName }) =>
            getRoomName(endpointName, readModelName, resolverName)
          )
        );
        ioLog.debug(`Registered ${socket.id} for ${JSON.stringify(resolvers)}`);
      } catch (err) {
        ioLog.error(
          `Can't register ${socket.id} for ${JSON.stringify(resolvers)}: ${err}`
        );
      }
    });
  });

  const handler = (req, res) => {
    const changeInfo = req.body;
    try {
      const { endpointName, readModelName, resolverName } = changeInfo;
      const roomName = getRoomName(endpointName, readModelName, resolverName);
      io.to(roomName).emit('change', changeInfo);
      rmLog.debug(`Forwarded changeInfo ${JSON.stringify(changeInfo)}`);
      res.sendStatus(200);
    } catch (err) {
      rmLog.error(
        `Can't forward changeInfo ${JSON.stringify(changeInfo)}: ${err}`
      );
      res.sendStatus(500);
    }
  };

  return handler;
};

module.exports = { createNotifier };
