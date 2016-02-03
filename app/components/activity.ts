import * as ng from 'angular2/core';
import * as rx from 'rxjs';
import moment from 'moment';
import {Activity} from '../models';
import {ACTIVITY_SERVICE, ActivityService} from '../services';
import './activity.css!';

interface Link {
  name:string;
  url:string;
}

interface Item {
  name:string;
  date:string;
  preview:string;
  links:Link[];
}

@ng.Component({
  selector: 'content-activity',
  templateUrl: 'app/components/activity.html'
})
export class Activity implements ng.OnInit {
  private items:Item[];

  constructor(@ng.Inject(ACTIVITY_SERVICE) private activityService:ActivityService) {
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
    let subscription = this.activityService
      .activities()
      .map((activities:Activity[]) => {
        return activities
          .sort((a, b) => (a.date > b.date) ? -1 : 1)
          .map(activity => {
            let name:string = activity.name;
            let date:string = moment(activity.date).format('MMM D, YYYY');
            let preview:string;
            let links:Link[] = [];

            switch (activity.from) {
              case 'github':
                preview = 'assets/github.svg';
                links.push({name: 'github', url: activity.github.html_url});
                if (this.hasGhPages(activity)) links.push({
                  name: 'pages',
                  url: `http://iamssen.github.io/${activity.github.name}`
                });
                break;
              case 'gist':
                preview = 'assets/gist.svg';
                links.push({name: 'gist', url: activity.gist.html_url});
                break;
              case 'jsfiddle':
                preview = 'assets/jsfiddle.svg';
                links.push({name: 'jsfiddle', url: activity.jsfiddle.url});
                break;
              case 'behance':
                preview = this.chooseBehanceCover(activity);
                links.push({name: 'behance', url: activity.behance.url});
                break;
            }
            return {name, preview, links, date};
          })
      })
      .subscribe(
        x => this.items = x,
        e => console.log(e),
        () => subscription && subscription.unsubscribe()
      )
  }
}