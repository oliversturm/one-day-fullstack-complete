const { MongoClient } = require('mongodb');

const { getLogger } = require('fullstack-demo-logger');

const log = getLogger('CmdProc/ES');

const replay = dbContext => cmdProcContext =>
  Promise.all([
    cmdProcContext.aggregateStore.startReplay(),
    cmdProcContext.eventBus.publishReplayState(true)
  ])
    .then(
      () =>
        new Promise((resolve, reject) =>
          dbContext.collection
            .find({})
            .sort({ timestamp: 1 })
            .each((err, event) => {
              if (err) reject(err);
              if (event) {
                return Promise.all([
                  cmdProcContext.aggregateStore.applyAggregateProjection(event),
                  cmdProcContext.eventBus.publishEvent(event)
                ]);
              } else {
                resolve();
                return false;
              }
            })
        )
    )
    .then(() =>
      Promise.all([
        cmdProcContext.aggregateStore.endReplay(),
        cmdProcContext.eventBus.publishReplayState(false)
      ])
    );

const createEventStore = () => {
  const url =
    process.env.EVENT_STORE_MONGODB_URL || 'mongodb://127.0.0.1:27017';
  const database = process.env.EVENT_STORE_DATABASE || 'events';
  const collection = process.env.EVENT_STORE_COLLECTION || 'events';

  return MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .catch(err => {
      log.error(`Can't connect to MongoDB at ${url}: ${err}`);
    })
    .then(client => ({ client, db: client.db(database) }))
    .then(dbContext => ({
      ...dbContext,
      collection: dbContext.db.collection(collection)
    }))
    .then(dbContext => ({
      addEvent: event =>
        dbContext.collection
          .insertOne(event)
          .catch(err => {
            log.error(`Can't insert event ${event}: ${err}`);
          })
          .then(() => {
            // Questionable mongodb behavior: insertOne mutates
            // the source object to add the mongodb _id property.
            // We want to publish the event object later, so
            // mongodb artefacts are not wanted here.
            delete event._id;
            return event;
          }),
      close: () => dbContext.client.close(),
      replay: replay(dbContext)
    }));
};

module.exports = { createEventStore };
