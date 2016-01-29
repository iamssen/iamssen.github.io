import {Activity} from "./activity.model";
import * as Rx from 'rxjs';

export interface Service {
  hello():Promise<string>;
  getActivity():Rx.Observable<Activity[]>;
}

export interface Analytics {
}