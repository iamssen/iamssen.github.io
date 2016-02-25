import {Component, OnInit, Inject, ElementRef} from 'angular2/core';
import d3tip from 'd3tip';
import {Data} from './basic-chart/data';
import {BarChart} from './basic-chart/bar';
import {ColumnChart} from './basic-chart/column';
import {PieChart} from './basic-chart/pie';
import {LineChart} from './basic-chart/line';
import {BubbleChart} from './basic-chart/bubble';
import 'd3tip/dist/d3tip.css!';

@Component({
  selector: 'basic-column-chart',
  template: `
  <div align="right">
    <button type="button" class="btn btn-secondary" (click)="refresh()">Refresh</button>
  </div>
  <svg class="radar-chart"></svg>
  <svg class="pie-chart"></svg>
  <svg class="bubble-chart"></svg>
  <svg class="line-chart"></svg>
  <svg class="column-chart"></svg>
  <svg class="bar-chart"></svg>
  `
})
export class BasicChart implements OnInit {
  private columnChart:ColumnChart;
  private barChart:BarChart;
  private pieChart:PieChart;
  private lineChart:LineChart;
  private bubbleChart:BubbleChart;

  constructor(@Inject(ElementRef) private elementRef:ElementRef) {
  }

  ngOnInit() {
    this.columnChart = new ColumnChart(
      d3.select(this.elementRef.nativeElement).select('.column-chart'),
      540,
      320,
      {TOP: 20, BOTTOM: 30, LEFT: 50, RIGHT: 20}
    );
    this.barChart = new BarChart(
      d3.select(this.elementRef.nativeElement).select('.bar-chart'),
      540,
      320,
      {TOP: 20, BOTTOM: 30, LEFT: 50, RIGHT: 20}
    );
    this.pieChart = new PieChart(
      d3.select(this.elementRef.nativeElement).select('.pie-chart'),
      160
    );
    this.lineChart = new LineChart(
      d3.select(this.elementRef.nativeElement).select('.line-chart'),
      540,
      320,
      {TOP: 20, BOTTOM: 30, LEFT: 50, RIGHT: 20}
    );
    this.bubbleChart = new BubbleChart(
      d3.select(this.elementRef.nativeElement).select('.bubble-chart'),
      540,
      320,
      {TOP: 20, BOTTOM: 30, LEFT: 50, RIGHT: 20}
    );
    this.refresh();
  }

  refresh() {
    const data = this.data();
    this.columnChart.update(data);
    this.barChart.update(data);
    this.pieChart.update(data);
    this.lineChart.update(data);
    this.bubbleChart.update(data);
  }

  data():Data[] {
    let max:number = Math.random() * 1000;
    let arr = [];
    let f:number = -1;
    let fmax:number = 3 + (Math.random() * 6);
    while (++f < fmax) {
      arr.push({
        Category: 1980 + f,
        Data1: Math.random() * max,
        Data2: Math.random() * max,
        Data3: Math.random() * max,
        Data4: Math.random() * max
      })
    }
    return arr;
  }
}

