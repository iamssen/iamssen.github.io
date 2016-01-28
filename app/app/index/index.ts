import {Component, Inject, OnInit} from 'angular2/core';
import {EVENT_BUS, EventBus} from 'angular2-reflow';
import {Activity} from '../service/activity.model';
import './index.css!';

interface Link {
  name:string;
  url:string;
}

interface Item {
  name:string;
  preview:string;
  links:Link[];
}

@Component({
  selector: 'content-index',
  template: `
  <h1 class="content-index">ACTIVITIES</h1>
  <div class="row content-index">
    <div class="col s12 m4" *ngFor="#item of items">
      <div class="card">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="activator" src="{{item.preview}}"/>
        </div>
        <div class="card-content">
          <span class="card-title activator grey-text text-darken-4">{{item.name}}.</span>
          <p><a *ngFor="#link of item.links" href="{{link.url}}" target="_blank">{{link.name}}</a></p>
        </div>
        <div class="card-reveal">
          <span class="card-title grey-text text-darken-4">{{item.name}}<i class="material-icons right">close</i></span>
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
  </div>
  `
})
export class Index implements OnInit {
  items:Item[];

  constructor(@Inject('service') private service) {
  }

  chooseBehanceCover(activity:Activity):string {
    let sizes:string[] = ['404', '230', '202', '115'];
    let f:number = -1;
    let fmax:number = sizes.length;
    while (++f < fmax) {
      let size:string = sizes[f];
      if (typeof activity.behance.covers[size] === 'string') return activity.behance.covers[size];
    }
    return '';
  }

  hasGhPages(activity:Activity):boolean {
    return activity.github.branches.filter(branch => branch.name === 'gh-pages').length > 0;
  }

  ngOnInit() {
    this.service
        .getActivity()
        .subscribe(
            (activities:Activity[]) => {
              this.items = activities
                  .sort((a, b) => (a.date > b.date) ? -1 : 1)
                  .map(activity => {
                    let name:string = activity.name;
                    let preview:string;
                    let links:Link[] = [];

                    switch (activity.from) {
                      case 'github':
                        preview = 'app/app/index/index.png';
                        links.push({name: 'github', url: activity.github.html_url});
                        if (this.hasGhPages(activity)) links.push({
                          name: 'gh-pages',
                          url: `http://iamssen.github.io/${activity.github.name}`
                        });
                        break;
                      case 'gist':
                        preview = 'app/app/index/index.png';
                        links.push({name: 'gist', url: activity.gist.html_url});
                        break;
                      case 'jsfiddle':
                        preview = 'app/app/index/index.png';
                        links.push({name: 'jsfiddle', url: activity.jsfiddle.url});
                        break;
                      case 'behance':
                        preview = this.chooseBehanceCover(activity);
                        links.push({name: 'behance', url: activity.behance.url});
                        break;
                    }
                    return {name, preview, links};
                  });
            },
            (error:Error) => {
              console.log('Error!!!', error)
            }
        );
  }
}