module.exports = {
  apps: [
    {
      name: 'command-processor',
      script: 'index.js',
      cwd: './packages/command-processor',
      env: {
        FORCE_COLOR: 1,
        LOG_LEVEL: 'trace'
      }
    },
    {
      name: 'readmodel-customers',
      script: 'index.js',
      cwd: './packages/readmodel-customers',
      env: {
        FORCE_COLOR: 1,
        LOG_LEVEL: 'trace',
        STORE_DATABASE: 'readmodel-customers',
        API_PORT: 3003,
        COMMAND_ENDPOINT: 'http://127.0.0.1:3001/api/command',
        CHANGE_NOTIFIER_ENDPOINT: 'http://127.0.0.1:3006/change'
      }
    },
    {
      name: 'readmodel-orders',
      script: 'index.js',
      cwd: './packages/readmodel-orders',
      env: {
        FORCE_COLOR: 1,
        LOG_LEVEL: 'trace',
        STORE_DATABASE: 'readmodel-orders',
        API_PORT: 3005,
        COMMAND_ENDPOINT: 'http://127.0.0.1:3001/api/command',
        CHANGE_NOTIFIER_ENDPOINT: 'http://127.0.0.1:3006/change'
      }
    },
    {
      name: 'change-notifier',
      script: 'index.js',
      cwd: './packages/fullstack-demo-change-notifier',
      env: {
        FORCE_COLOR: 1,
        LOG_LEVEL: 'trace',
        API_PORT: 3006
      }
    },
    {
      name: 'frontend',
      cwd: './packages/frontend',
      script: 'npm',
      args: 'start'
    }
  ]
};
