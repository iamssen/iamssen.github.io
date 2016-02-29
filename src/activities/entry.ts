import {connect} from 'react-redux';

import * as types from '../types';
import {replaceReducers} from '../store';
import {Activities} from './components';
import * as reducers from './reducers';

const Component = connect(state => ({
  dispatch: state.dispatch,
  activities: state.activities
}))(Activities);

const onEnter = (location, cb:(err, Component) => void) => {
  replaceReducers(reducers);
  cb(null, Component);
}

export default function ():types.Content {
  return {title: 'Activities', getComponent: onEnter};
}