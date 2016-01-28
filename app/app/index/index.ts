import {Component, Inject, OnInit} from 'angular2/core';
import {EVENT_BUS, EventBus} from 'angular2-reflow';
import {Activity} from '../service/activity.model';

@Component({
  selector: 'content-index',
  template: `
  <h1>hello {{message}}</h1>
  <ul>
    <li *ngFor="#activity of activities">{{activity.name}}</li>
  </ul>
  `
})
export class Index implements OnInit {
  activities:Activity[];

  constructor(@Inject('service') private service) {
  }

  ngOnInit() {
    this.service
        .getActivity()
        .subscribe(
            (activities:Activity[]) => {
              this.activities = activities;
            },
            (error:Error) => {
              console.log('Error!!!', error)
            }
        );
  }
}