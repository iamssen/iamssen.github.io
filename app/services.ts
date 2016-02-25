import * as ng from 'angular2/core';
import * as rx from 'rxjs';
import {github, jsfiddle, Activity} from './models';
import {ACTIVITY_STORE, ActivityStore} from './stores';

export const GITHUB_SERVICE:string = 'githubService';
export const JSFIDDLE_SERVICE:string = 'jsfiddleService';
export const ACTIVITY_SERVICE:string = 'activityService';
export const ANALYTICS_SERVICE:string = 'analyticsService';

export interface GithubService {
  repositories():rx.Observable<github.Repository[]>;
  gists():rx.Observable<github.Gist[]>;
}

export interface JsFiddleService {
  fiddles():rx.Observable<jsfiddle.Fiddle[]>;
}

export interface ActivityService {
  activities():rx.Observable<Activity[]>;
}

@ng.Injectable()
export class ActivityService {
  constructor(@ng.Inject(ACTIVITY_STORE) private activityStore:ActivityStore) {
  }

  activities():rx.Observable<Activity[]> {
    if (this.activityStore.activities) {
      return rx.Observable.of(this.activityStore.activities);
    }

    return rx.Observable
      .fromPromise<Activity[]>($.getJSON(`store/activity.json`) as Promise)
      .do((activities:Activity[]) => this.activityStore.activities = activities)
  }
}

export interface AnalyticsService {
}