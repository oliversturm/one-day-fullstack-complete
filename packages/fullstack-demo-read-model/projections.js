const Queue = require('promise-queue');
const { memoize } = require('lodash/fp');
const { getLogger } = require('fullstack-demo-logger');

const log = getLogger('ReadMod/Proj');

const createProjectionHandler = context => {
  const eventQueue = new Queue(1, Infinity);
  const projectionContext = {
    storage: context.storage,
    commands: context.commands,
    changeNotification: context.changeNotification
  };
  const getProjectionContext = memoize(rmName =>
    memoize(inReplay => ({
      ...projectionContext,
      log: getLogger(`ReadMod/${rmName}`),
      sideEffects: context.sideEffects.getSideEffectsHandler(inReplay)
    }))
  );

  return Promise.resolve({
    projectEvent: (event, inReplay) =>
      eventQueue.add(() =>
        new Promise((resolve, reject) => {
          // collect all the require projection functions
          // across read models
          const projections = Object.keys(context.readModels)
            .map(rmName => {
              const rm = context.readModels[rmName];
              const projection = rm.projections && rm.projections[event.type];
              if (projection) {
                if (event.timestamp > (rm.lastProjectedEventTimestamp || 0))
                  return [rmName, projection];
                else {
                  if (!inReplay) {
                    reject(
                      `Event out of sequence for read model '${rmName}' (last projected: ${
                        rm.lastProjectedEventTimestamp
                      }): ${JSON.stringify(event)}`
                    );
                  }
                  return null;
                }
              } else return null;
            })
            .filter(el => !!el)
            .filter(([, f]) => !!f);
          resolve(projections);
        })
          .catch(err => {
            log.error(
              `Can't find valid projections for ${JSON.stringify(
                event
              )}: ${err}`
            );
          })

          .then(rmProjections => {
            if (rmProjections.length)
              log.debug(
                `Projecting event for read models: ${JSON.stringify(
                  rmProjections.map(([rmName]) => rmName)
                )} (inReplay=${inReplay})`
              );
            return rmProjections;
          })
          .then(rmProjections =>
            Promise.all(
              // remember the timestamp internally
              rmProjections.map(([rmName]) => {
                context.readModels[rmName].lastProjectedEventTimestamp =
                  event.timestamp;
              })
            ).then(() => rmProjections)
          )
          .catch(err => {
            log.error(
              `Can't update internal last projected event timestamps for ${JSON.stringify(
                event
              )}: ${err}`
            );
          })

          .then(rmProjections =>
            Promise.all(
              // call the projections
              rmProjections.map(([rmName, f]) =>
                f(getProjectionContext(rmName)(inReplay), event)
              )
            )
              .catch(err => {
                log.error(
                  `Can't project event ${JSON.stringify(event)}: ${err}`
                );
              })
              .then(() =>
                // update the timestamps in the database
                context.storage.updateLastProjectedEventTimestamps(
                  rmProjections.map(([rmName]) => rmName),
                  event.timestamp
                )
              )
              .catch(err => {
                log.error(
                  `Can't update persistent last projected event timestamps for ${JSON.stringify(
                    event
                  )}: ${err}`
                );
              })
          )
      )
  });
};

module.exports = { createProjectionHandler };
