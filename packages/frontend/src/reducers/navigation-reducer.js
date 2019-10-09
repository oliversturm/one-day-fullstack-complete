// commonJS, don't use import - to support command-magic
const uuid = require('uuid/v4');
const { generateExport } = require('./command-magic');

const map = {
  CUSTOMERS_VIEW: {
    command: 'customersView',
    aliases: ['homeView'],
    handle: s => s.set('currentView', 'customers')
  },

  ORDERS_VIEW: {
    command: 'ordersView',
    handle: s => s.set('currentView', 'orders')
  },

  CUSTOMER_VIEW: {
    command: 'customerView',
    create: customerId => ({
      id: customerId || uuid()
    }),
    handle: (s, a) =>
      s.merge({
        currentView: 'customer',
        customerId: a.payload.id
      })
  },

  ORDER_VIEW: {
    command: 'orderView',
    create: customerId => ({
      id: uuid(),
      customerId
    }),
    handle: (s, { payload: { id, customerId, customerName } }) =>
      s.merge({
        currentView: 'order',
        id,
        customerId
      })
  },

  ABOUT_VIEW: {
    command: 'aboutView',
    create: () => ({}),
    handle: s => s.set('currentView', 'about')
  }
};

module.exports = generateExport(map, 'createNavigationReducer');
