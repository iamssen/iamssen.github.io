import {Component, Inject, OnInit} from 'angular2/core';
import {EVENT_BUS, EventBus} from 'angular2-reflow';

@Component({
  selector: 'content-index',
  template: `<h1>hello {{message}}</h1>`
})
export class Index implements OnInit {
  message:string = 'Test';

  constructor(@Inject('service') private service,
              @Inject(EVENT_BUS) private eventBus:EventBus) {
  }

  ngOnInit() {
    this.service
        .hello()
        .then(result => {
          this.message = result;
          this.eventBus.fire(new Event('eventBusTest'));
          this.eventBus.fire(new Event('execute-commands'));
        });
  }
}