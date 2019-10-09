// commonJS, don't use import - to support command-magic
const { generateExport } = require('./command-magic');

// The command-magic generateExport creates these elements for me:
//
// const customersViewDataLoaded = data => ({
//   type: 'CUSTOMERS_VIEW_DATA_LOADED',
//   payload: { data }
// });

// const createCustomersViewReducer = (initialState = Im({})) => (
//   state = initialState,
//   action = {}
// ) => {
//   switch (action.type) {
//     case 'CUSTOMERS_VIEW_DATA_LOADED':
//       return state.set('data', action.payload.data);
//     default:
//       return state;
//   }
// };

const map = {
  CUSTOMERS_VIEW_DATA_LOADED: {
    command: 'customersViewDataLoaded',
    create: data => ({ data }),
    handle: (s, { payload: { data } }) => s.set('data', data)
  },

  CUSTOMERS_VIEW_NOTIFY_CHANGE: notifyChangeCommand('customersViewNotifyChange')
};

module.exports = generateExport(map, 'createCustomersViewReducer');
