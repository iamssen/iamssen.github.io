import * as React from 'react';
import * as d3 from 'd3';
import d3tip from 'd3tip';

import {Data} from '../../types';

class Chart {
  private _svg:d3.Selection<any>;
  private _g:d3.Selection<Data>;
  private _pie:d3.layout.Pie<any>;
  private _arc:d3.svg.Arc<any>;
  private _radius:number;
  private _easeOut:(t:number)=>number;
  private _easeIn:(t:number)=>number;
  private _invalidated:boolean;
  private _prev:d3.Selection<any>;

  public duration:number;
  public delay:number;
  public width:number;
  public height:number;
  public color:d3.scale.Ordinal<string, string>;

  //duration:number = 300;
  //color:d3.scale.Ordinal<string, string>;
  //g:d3.Selection<Data>;
  //pie:d3.layout.Pie;
  //arc:d3.svg.Arc;
  //easeOut:(t:number)=>number;
  //easeIn:(t:number)=>number;
  //prev:d3.Selection<any>;

  //constructor(private svg:d3.Selection<any>,
  //            private RADIUS:number) {
  //  this.color = d3.scale.category20c();
  //  this.pie = d3.layout.pie().value((d:any) => d.Data1).sort(null);
  //  this.arc = d3.svg.arc().outerRadius(RADIUS - 20).innerRadius(RADIUS - 60);
  //
  //  this.svg.attr({
  //    width: this.RADIUS * 2,
  //    height: this.RADIUS * 2
  //  });
  //
  //  this.g = this.svg.append('g').attr('transform', `translate(${this.RADIUS}, ${this.RADIUS})`);
  //  this.easeIn = d3.ease('quad-in');
  //  this.easeOut = d3.ease('quad-out');
  //}

  constructor(private svg:EventTarget) {
    this._svg = d3.select(svg);
    this._g = this._svg.append('g');
    this._easeIn = d3.ease('quad-in');
    this._easeOut = d3.ease('quad-out');
    this._invalidated = true;
  }

  invalidate() {
    this._invalidated = true;
  }

  update(data:Data[]) {
    if (this._invalidated) {
      this._svg.attr({width: this.width, height: this.height});

      this._radius = Math.floor(d3.min([this.width, this.height]) / 2);

      this._pie = d3.layout.pie().value((d:any) => d.Data1).sort(null);
      this._arc = d3.svg.arc().outerRadius(this._radius - 20).innerRadius(this._radius - 60);

      this._g.attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

      this._invalidated = false;
    }

    const pieData = this._pie(data);
    const arc = this._arc;

    if (this._prev) {
      this._prev
        .transition()
        .duration(this.duration)
        .tween('exit arc', function () {
          let selection = d3.select(this);
          return (t:number) => {
            let r = 1 - t;
            let a = (Math.PI * 2) - (Math.PI * 2 * r);
            selection.attr('d', (d, i) => {
              let start = (d.startAngle * r) + a;
              let end = (d.endAngle * r) + a;
              return arc.startAngle(start).endAngle(end)(d, i);
            })
          }
        })
        .remove();
    }

    let path:d3.Selection<any> = this._g
      .selectAll('.path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('fill', (d) => this.color(d.data.Category))
      .call(d3tip({
        html: (d:{data:Data}) => `<h5>${d.data.Category}</h5>${d.data.Data1}`
      }))

    path.transition()
      .duration(this.duration)
      .tween('entry arc', function () {
        let selection = d3.select(this);
        return (t:number) => {
          selection.attr('d', (d, i) => {
            let start = d.startAngle * t;
            let end = d.endAngle * t;
            return arc.startAngle(start).endAngle(end)(d, i);
          })
        }
      });

    this._prev = path;
  }
}

interface Props {
  duration?:number;
  delay?:number;
  width?:number;
  height?:number;
  color?:d3.scale.Ordinal<string, string>;
  data?:Data[];
}

export default class Component extends React.Component<Props, any> {
  private chart:Chart;

  static defaultProps:Props = {
    duration: 300,
    delay: 40,
    width: 540,
    height: 320,
    color: d3.scale.category20c()
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (<svg className="basic-chart-bubble" ref="svg"/>);
  }

  bind(props:Props) {
    const chart = this.chart;
    chart.duration = props.duration;
    chart.delay = props.delay;
    chart.width = props.width;
    chart.height = props.height;
    chart.color = props.color;
    chart.invalidate();
  }

  componentDidMount():void {
    this.chart = new Chart(this.refs['svg'] as Element);
    this.bind(this.props);
  }

  componentWillUnmount():void {
    this.chart = null;
  }

  shouldComponentUpdate(nextProps:Props, nextState:any, nextContext:any):boolean {
    if (this.props.duration !== nextProps.duration
      || this.props.delay !== nextProps.delay
      || this.props.width !== nextProps.width
      || this.props.height !== nextProps.height
      || this.props.color !== nextProps.color) {
      this.bind(nextProps);
    }
    if (this.props.data !== nextProps.data) {
      this.chart.update(nextProps.data);
    }
    return false;
  }
}