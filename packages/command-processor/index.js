const { startCommandProcessor } = require('fullstack-demo-command-processor');
const aggregates = require('./aggregates');

startCommandProcessor(aggregates);
