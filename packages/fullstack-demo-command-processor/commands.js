const { getLogger } = require('fullstack-demo-logger');

const log = getLogger('CmdProc/Handler');

const createApiHandler = ({
  aggregateStore,
  eventStore,
  eventBus,
  aggregates
}) => (req, res) => {
  log.debug(`Command received: ${JSON.stringify(req.body)}`);
  const { command, aggregateName, aggregateId, payload } = req.body;
  if (!command || !aggregateName || !aggregateId) {
    res.status(400).send('Missing field');
    return;
  }

  const aggregate = aggregates[aggregateName];
  if (!aggregate) {
    res.status(400).send('Invalid aggregate name');
    return;
  }

  const commandHandler = aggregate.commands && aggregate.commands[command];
  if (!commandHandler) {
    res.status(400).send('Invalid command name');
    return;
  }

  return Promise.resolve(
    aggregateStore.getAggregateState(aggregateName, aggregateId)
  )
    .then(aggregateState => commandHandler(aggregateState, payload))
    .then(eventMixin => {
      if (!eventMixin.type)
        throw new Error(
          `Event created for command ${command} on aggregate ${aggregateName}(${aggregateId}) has no 'type'`
        );
      const event = {
        ...eventMixin,
        timestamp: Date.now(),
        aggregateName,
        aggregateId
      };
      log.debug(`Event generated: ${JSON.stringify(event)}`);
      return event;
    })
    .then(eventStore.addEvent)
    .then(aggregateStore.applyAggregateProjection)
    .then(eventBus.publishEvent)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      log.error(`An error occurred handling command ${command} for aggregate ${aggregateName}(${aggregateId}) with payload:

${JSON.stringify(payload)}
      
${err}`);
      res.sendStatus(500);
    });
};

module.exports = { createApiHandler };
