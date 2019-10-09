// commonJS, don't use import - to support command-magic
const { generateExport } = require('./command-magic');

const map = {
  CUSTOMER_VIEW_DATA_LOADED: {
    command: 'customerViewDataLoaded',
    create: data => ({ data }),
    handle: (s, { payload: { data } }) => s.set('data', data)
  }
};

module.exports = generateExport(map, 'createCustomerViewReducer');
