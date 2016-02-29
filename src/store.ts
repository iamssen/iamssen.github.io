import {createStore, applyMiddleware, Store, combineReducers} from 'redux';
const thunkMiddleware = require('redux-thunk');
//const createLogger = require('redux-logger');

import * as appReducers from './reducers';

// , createLogger()
//const logger = store => next => action => {
//  console.log('????',  action);
//  return next(action);
//}

const store:Store = createStore(
  combineReducers(appReducers), {},
  applyMiddleware(thunkMiddleware)
)

function replaceReducers(contentReducers) {
  store.replaceReducer(combineReducers(Object.assign({}, appReducers, contentReducers)));
}

export {store, replaceReducers}