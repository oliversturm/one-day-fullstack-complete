const { createStore } = require('./storage');
const { createEventBus } = require('./eventBus');
const { createProjectionHandler } = require('./projections');
const { createSideEffectsHandler } = require('./sideEffects');
const { createChangeNotificationHandler } = require('./changeNotification');
const { createCommandHandler } = require('./commands');

const initializeContext = readModels =>
  createStore()
    .then(storage => ({ storage, readModels }))
    .then(context =>
      context.storage
        .readLastProjectedEventTimestamps(readModels)
        .then(() => context)
    )
    .then(context =>
      createCommandHandler(context).then(commands => ({
        ...context,
        commands
      }))
    )
    .then(context =>
      createSideEffectsHandler().then(sideEffects => ({
        ...context,
        sideEffects
      }))
    )
    .then(context =>
      createChangeNotificationHandler().then(changeNotification => ({
        ...context,
        changeNotification
      }))
    )
    .then(context =>
      createProjectionHandler(context).then(projectionHandler => ({
        ...context,
        projectionHandler
      }))
    )
    .then(context => createEventBus(context).then(() => context));

module.exports = { initializeContext };
