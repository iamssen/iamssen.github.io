import {RouteDefinition} from 'angular2/router';
import {Github} from "./github";
import {JsFiddle} from './jsfiddle';
import {Activity} from './activity';
import {Infographics} from './infographics';

let routeConfig:RouteDefinition[] = [
  {path: '/', name: 'Activities', component: Activity},
  {path: '/infographics/...', name: 'Infographics', component: Infographics, link: ['Infographics', 'Data Grid Basic']},
  {path: '/github', name: 'Github', component: Github},
  {path: '/jsfiddle', name: 'JS Fiddle', component: JsFiddle}
];

routeConfig.forEach(route => {
  if (!route.hasOwnProperty('link')) route['link'] = [route.name];
});

export {routeConfig};