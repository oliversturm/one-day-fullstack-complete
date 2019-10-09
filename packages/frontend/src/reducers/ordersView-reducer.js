// commonJS, don't use import - to support command-magic
const { generateExport } = require('./command-magic');
const notifyChangeCommand = require('./notifyChangeCommand');

const map = {
  ORDERS_VIEW_DATA_LOADED: {
    command: 'ordersViewDataLoaded',
    create: data => ({ data }),
    handle: (s, { payload: { data } }) => s.set('data', data)
  },

  ORDERS_VIEW_NOTIFY_CHANGE: notifyChangeCommand('ordersViewNotifyChange')
};

module.exports = generateExport(map, 'createOrdersViewReducer');
