import * as ng from 'angular2/core';
import * as router from 'angular2/router';
import * as rf from 'angular2-reflow';
import {routeConfig} from './infographics/route-config';

@ng.Component({
  selector: 'content-infographics',
  templateUrl: 'app/components/infographics.html',
  directives: [router.ROUTER_DIRECTIVES]
})
@router.RouteConfig(routeConfig)
export class Infographics implements ng.OnInit, ng.OnDestroy {
  private routeConfig:router.RouteDefinition[];

  constructor(@ng.Inject(router.Location) private location:router.Location) {
    this.routeConfig = routeConfig;
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  isActive(path:string):boolean {
    //noinspection TypeScriptUnresolvedFunction
    let locationPath:string = this.location.path();
    path = `/infographics${path}`;
    console.log(locationPath, path)
    if (locationPath === '/infographics' && path === '/infographics/') return true;
    return locationPath === path;
  }
}