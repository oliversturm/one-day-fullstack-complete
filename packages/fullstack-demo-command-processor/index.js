const { initializeContext } = require('./context');
const { runExpress } = require('./express');

const startCommandProcessor = aggregates =>
  initializeContext(aggregates).then(context => runExpress(context));

module.exports = { startCommandProcessor };
