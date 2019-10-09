const { initializeContext } = require('./context');
const { runExpress } = require('./express');

const startReadModel = readModels =>
  initializeContext(readModels).then(context => runExpress(context));

module.exports = { startReadModel };
