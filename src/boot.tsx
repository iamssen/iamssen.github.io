/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="./d.ts"/>
import 'es6-shim';
import * as React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, IndexRoute, Route, hashHistory} from 'react-router';

import * as types from './types';
import {store, replaceReducers} from './store';
import {indexRoute, childRoutes} from './routeConfig';
import {App, Menu} from './components';

import './style.less';

function onUpdateHook(...args) {
  console.log('Boot.tsx..onUpdateHook()', args, this.state.location.key);
}

const routes = Object.freeze({
  path: '/',
  component: App,
  indexRoute: indexRoute,
  childRoutes: childRoutes
})

render(
  <Provider store={store}>
    <Router history={hashHistory} routes={routes} onUpdate={onUpdateHook}/>
  </Provider>,
  document.getElementById('app')
)
