import {Component, Inject, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList} from 'angular2/core';
import {EVENT_BUS, EventBus} from 'angular2-reflow';
import {Activity} from '../service/activity.model';
import moment from 'moment';
import './index.css!';

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

@Component({
  selector: 'content-index',
  templateUrl: 'app/app/index/index.html'
})
export class Index implements OnInit, AfterViewInit {
  @ViewChildren('card') cards:QueryList<ElementRef>;
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
      .map<Item[]>((activities:Activity[]) => {
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
        (items:Item[]) => this.items = items,
        (error:Error) => console.log('Error!!!', error)
      );
  }

  ngAfterViewInit() {
    this.cards.changes.subscribe((q:QueryList) => {
      setTimeout(() => {
        q
          .toArray()
          .map<Element>((elementRef:ElementRef) => elementRef.nativeElement)
          .forEach(element => {
            let el = $(element);
            if (el.offset().top < $(window).height() + 200) {
              el.css('opacity', 1);
            } else {
              let wp:Waypoint = new Waypoint({
                element: element,
                handler: () => {
                  el.css('opacity', 1);
                  wp.destroy();
                },
                offset: 'bottom-in-view'
              })
            }
          })
      }, 1);
    })
  }
}