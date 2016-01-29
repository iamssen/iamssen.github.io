import {Provider, Inject, Injectable} from 'angular2/core';
import {Router} from 'angular2/router';
import {Activity} from '../app/service/activity.model';
import * as reflow from 'angular2-reflow';
import * as service from '../app/service/service';
import * as Rx from 'rxjs';
import {Http, Response} from 'angular2/http';

@Injectable()
class Service implements service.Service {
  constructor(private http:Http) {
  }

  hello():Promise<string> {
    return new Promise(function (resolve, reject) {
      setTimeout(() => resolve('web service'), 1000);
    });
  }

  getActivity():Rx.Observable<Activity[]> {
    return Rx
        .Observable
        .fromPromise($.getJSON('store/activity.json') as Promise);
  }
}

declare function ga(send:string, preview:string, path:string);

@Injectable()
class Analytics implements service.Analytics {
  constructor(private router:Router) {
    router.subscribe(path => ga('send', 'preview', `/${path}`));
  }
}

class Command1 implements reflow.Command {
  constructor(@Inject('service') private service:service.Service) {
  }

  execute(chain:reflow.CommandChain) {
    setTimeout(() => {
      console.log('web command1 executed', this.service);
      chain.next();
    }, 1000);
  }

  stop() {
  }
}

class Command2 implements reflow.Command {
  constructor(@Inject('service') private service:service.Service) {
  }

  execute(chain:reflow.CommandChain) {
    setTimeout(() => {
      console.log('web command2 executed', this.service);
      chain.next();
    }, 1000);
  }

  stop() {
  }
}

class Command3 implements reflow.Command {
  constructor(@Inject('service') private service:service.Service) {
  }

  execute(chain:reflow.CommandChain) {
    setTimeout(() => {
      console.log('web command3 executed', this.service);
      chain.next();
    }, 1000);
  }

  stop() {
  }
}

export class ContextFactory extends reflow.ContextFactory {
  mapDependency() {
    this.provide(new Provider('service', {useClass: Service}));
    this.provide(new Provider('analytics', {useClass: Analytics}));
    this.mapCommand('execute-commands', [Command1, Command2, Command3]);
  }
}