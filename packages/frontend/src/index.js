import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { connectRoutes } from 'redux-first-router';
import { createBrowserHistory as createHistory } from 'history';
import { SystemProvider } from './components/SystemContext';
import { activateChangeNotifier } from './changeNotifier';

//import mySaga from './sagas/my-saga';
const {
  createCustomersViewReducer,
  customersViewNotifyChange
} = require('./reducers/customersView-reducer');
const {
  createCustomerViewReducer
} = require('./reducers/customerView-reducer');
const {
  createOrdersViewReducer,
  ordersViewNotifyChange
} = require('./reducers/ordersView-reducer');

const {
  customersView,
  ordersView,
  customerView,
  orderView,
  aboutView,
  createNavigationReducer
} = require('./reducers/navigation-reducer');

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const routeMap = {
  [customersView.type]: '/(customers)?',
  [ordersView.type]: '/orders',
  [customerView.type]: '/customer/:id',
  [orderView.type]: '/order/:customerId/:id',
  [aboutView.type]: '/about'
};

const navigationReducer = createNavigationReducer();

const {
  reducer: routingReducer,
  middleware: routingMiddleware,
  enhancer: routingEnhancer,
  initialDispatch: initialRoutingDispatch
} = connectRoutes(routeMap, {
  initialDispatch: false,
  createHistory
});

const reducer = combineReducers({
  location: routingReducer,
  navigation: navigationReducer,
  customersView: createCustomersViewReducer(),
  customerView: createCustomerViewReducer(),
  ordersView: createOrdersViewReducer()
});
const middleware = applyMiddleware(sagaMiddleware, routingMiddleware);
const enhancers = composeEnhancers(routingEnhancer, middleware);

const store = createStore(reducer, enhancers);

//sagaMiddleware.run(mySaga);

// important to call this after sagas are running, otherwise the first
// dispatch sent by redux-first-router will come so early after the store
// is created that sagas can't catch it (that's the default behavior if
// I call connectRoutes above without the last parameter)
initialRoutingDispatch();

const readModelEndpoints = {
  // -- Standard demo values
  customers: 'http://127.0.0.1:3003',
  orders: 'http://127.0.0.1:3005'

  // -- Alternatives for running on ChromeOS
  // customers: 'http://penguin.linux.test:3003',
  // orders: 'http://penguin.linux.test:3005'
};

// -- Standard demo values
const commandEndpoint = 'http://127.0.0.1:3001/api/command';
const changeNotifierEndpoint = 'http://127.0.0.1:3006';

// -- Alternatives for running on ChromeOS
//const commandEndpoint = 'http://penguin.linux.test:3001/api/command';
//const changeNotifierEndpoint = 'http://penguin.linux.test:3006';

const changeNotificationMap = [
  {
    endpointName: 'customers',
    readModelName: 'overview',
    resolverName: 'all',
    actionCreator: customersViewNotifyChange
  },
  {
    endpointName: 'orders',
    readModelName: 'overview',
    resolverName: 'all',
    actionCreator: ordersViewNotifyChange
  }
];
activateChangeNotifier(changeNotifierEndpoint, changeNotificationMap, store);

const aggregates = {
  customer: {
    createCustomer: 'CREATE',
    updateCustomer: 'UPDATE'
  },
  order: {
    createOrder: 'CREATE'
  }
};

ReactDOM.render(
  <SystemProvider
    readModelEndpoints={readModelEndpoints}
    commandEndpoint={commandEndpoint}
    aggregates={aggregates}
  >
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </SystemProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
