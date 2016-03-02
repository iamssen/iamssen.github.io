import * as React from 'react';
import * as d3 from 'd3';
import d3tip from 'd3tip';

import {Data} from '../../types';

class Chart {
  private _svg:d3.Selection<any>;
  private _width:number;
  private _height:number;
  private _g:d3.Selection<Data>;
  private _x:d3.Selection<any>;
  private _y:d3.Selection<any>;
  private _easeOut:(t:number)=>number;
  private _easeIn:(t:number)=>number;
  private _invalidated:boolean;

  public duration:number;
  public delay:number;
  public width:number;
  public height:number;
  public gutterLeft:number;
  public gutterRight:number;
  public gutterTop:number;
  public gutterBottom:number;
  public color:d3.scale.Ordinal<string, string>;

  constructor(private svg:EventTarget) {
    this._svg = d3.select(svg);
    this._g = this._svg.append('g');
    this._x = this._g.append('g').attr('class', 'axis axis-x');
    this._y = this._g.append('g').attr('class', 'axis axis-y');
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

      this._width = this.width - this.gutterLeft - this.gutterRight;
      this._height = this.height - this.gutterTop - this.gutterBottom;

      this._g.attr('transform', `translate(${this.gutterLeft}, ${this.gutterTop})`);
      this._x.attr('transform', `translate(0, ${this._height})`);
      this._y.attr('transform', `translate(0, 0)`);

      this._invalidated = false;
    }

    let ymax:number = d3.max(data, d => d.Data1);
    let xscale = d3.scale.ordinal().rangeRoundBands([0, this._width]).domain(data.map(d => d.Category));
    let yscale = d3.scale.linear().rangeRound([this._height, 0]).domain([0, ymax]).nice();
    let rects = this._g.selectAll('rect').data(data);

    // update existing nodes
    rects
      .transition()
      .duration(this.duration)
      .delay((d, i) => this.delay * i)
      .ease(this._easeOut)
      .attr({
        fill: d => this.color(d.Category),
        x: d => xscale(d.Category),
        y: d => yscale(d.Data1),
        width: d => xscale.rangeBand(),
        height: d => this._height - yscale(d.Data1)
      })

    // remove ramaining nodes
    rects
      .exit()
      .transition()
      .duration(this.duration)
      .delay((d, i) => this.delay * i)
      .ease(this._easeIn)
      .attr({
        opacity: 0,
        x: this.width,
        y: this._height,
        width: 0,
        height: 0
      })
      .remove()

    // create additional nodes
    rects
      .enter()
      .append('rect')
      .attr({
        fill: d => this.color(d.Category),
        opacity: 0,
        x: d => xscale(d.Category),
        y: this._height,
        width: d => xscale.rangeBand(),
        height: 0
      })
      .call(d3tip({
        html: (d:Data) => `<h5>${d.Category}</h5>${d.Data1}`
      }))
      .transition()
      .duration(this.duration)
      .delay((d, i) => this.delay * i)
      .ease(this._easeOut)
      .attr({
        opacity: 1,
        y: d => yscale(d.Data1),
        height: d => this._height - yscale(d.Data1)
      })

    // draw axis
    let xaxis = d3.svg.axis().scale(xscale).orient('bottom');
    let yaxis = d3.svg.axis().scale(yscale).orient('left');

    this._x.call(xaxis);
    this._y.call(yaxis);
  }
}

interface Props {
  duration?:number;
  delay?:number;
  width?:number;
  height?:number;
  gutterLeft?:number;
  gutterRight?:number;
  gutterTop?:number;
  gutterBottom?:number;
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
    gutterLeft: 50,
    gutterRight: 20,
    gutterTop: 20,
    gutterBottom: 30,
    color: d3.scale.category20c()
  }

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (<svg className="basic-chart-column" ref="svg"/>);
  }

  bind(props:Props) {
    const chart = this.chart;
    chart.duration = props.duration;
    chart.delay = props.delay;
    chart.width = props.width;
    chart.height = props.height;
    chart.gutterLeft = props.gutterLeft;
    chart.gutterRight = props.gutterRight;
    chart.gutterTop = props.gutterTop;
    chart.gutterBottom = props.gutterBottom;
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
      || this.props.gutterLeft !== nextProps.gutterLeft
      || this.props.gutterRight !== nextProps.gutterRight
      || this.props.gutterTop !== nextProps.gutterTop
      || this.props.gutterBottom !== nextProps.gutterBottom
      || this.props.color !== nextProps.color) {
      this.bind(nextProps);
    }
    if (this.props.data !== nextProps.data) {
      this.chart.update(nextProps.data);
    }
    return false;
  }
}