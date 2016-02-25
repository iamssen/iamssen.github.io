import * as router from 'angular2/router';
import {BasicChart} from './basic-chart';
import {DataGridBasic} from './datagrid-basic';
import {DataGridMerge} from './datagrid-merge';

let routeConfig:router.RouteDefinition[] = [
  {path: '/', name: 'Data Grid Basic', component: DataGridBasic},
  {path: '/basic-chart', name: 'Basic Chart', component: BasicChart},
  {path: '/datagrid-merge', name: 'Data Grid Merge', component: DataGridMerge}
];

export {routeConfig};