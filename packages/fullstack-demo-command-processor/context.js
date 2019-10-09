const { createAggregateStore } = require('./aggregateStore');
const { createEventStore } = require('./eventStore');
const { createEventBus } = require('./eventBus');

const initializeContext = aggregates =>
  Promise.all([createAggregateStore(aggregates), createEventStore()])
    .then(([aggregateStore, eventStore]) => ({
      aggregates,
      aggregateStore,
      eventStore
    }))
    .then(context =>
      createEventBus().then(eventBus => ({ ...context, eventBus }))
    )
    .then(context => context.eventStore.replay(context).then(() => context));

module.exports = { initializeContext };
