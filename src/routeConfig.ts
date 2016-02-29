import {connect} from 'react-redux';

import * as types from './types';
import activities from './activities/entry';
import infographics from './infographics/entry';

export const indexRoute:types.Content = Object.freeze(
  activities()
)
export const childRoutes:types.Content[] = Object.freeze([
  infographics()
])