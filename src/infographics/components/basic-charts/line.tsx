import * as React from 'react';
import * as d3 from 'd3';
import d3tip from 'd3tip';

import {Data} from '../../types';

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
  private _svg:d3.Selection<any>;
  private _width:number;
  private _height:number;
  private _g:d3.Selection<Data>;
  private _x:d3.Selection<any>;
  private _y:d3.Selection<any>;
  private _easeOut:(t:number)=>number;
  private _easeIn:(t:number)=>number;
  private _path1:d3.Selection<any>;

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
    return (<svg className="basic-chart-bubble" ref="svg"/>);
  }

  draw(props:Props, drawTransition:boolean) {
    const data:Data[] = props.data;
    const ymax:number = d3.max(data, d => d.Data1);
    const xscale = d3.scale.ordinal().rangeRoundBands([0, this._width]).domain(data.map(d => d.Category));
    const yscale = d3.scale.linear().rangeRound([this._height, 0]).domain([0, ymax]).nice();

    const line1:any = d3.svg.line()
      .x((d:any, i) => xscale(d.Category) + (xscale.rangeBand() / 2))
      .y((d:any, i) => yscale(d.Data1));

    if (!this._path1) {
      const line0:any = d3.svg.line()
        .x((d:any, i) => xscale(d.Category) + (xscale.rangeBand() / 2))
        .y((d:any, i) => yscale.range()[0]);

      this._path1 = this._g.append('path');

      //noinspection TypeScriptValidateTypes
      (!drawTransition ? this._path1.datum(data) : this._path1.datum(data)
        .attr('d', line0)
        .transition()) // end transition
        .attr('d', line1);
    } else {
      //noinspection TypeScriptValidateTypes
      (!drawTransition ? this._path1.datum(data) : this._path1.datum(data)
        .transition()) // end transition
        .attr('d', line1);
    }

    this._path1.attr({
      fill: 'none',
      stroke: props.color('line1'),
      'stroke-width': '4px',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    });

    // draw axis
    const xaxis = d3.svg.axis().scale(xscale).orient('bottom');
    const yaxis = d3.svg.axis().scale(yscale).orient('left');

    this._x.call(xaxis);
    this._y.call(yaxis);
  }

  componentDidMount():void {
    this._svg = d3.select(this.refs['svg'] as Element);
    this._g = this._svg.append('g');
    this._x = this._g.append('g').attr('class', 'axis axis-x');
    this._y = this._g.append('g').attr('class', 'axis axis-y');
    this._easeIn = d3.ease('quad-in');
    this._easeOut = d3.ease('quad-out');
  }

  //componentWillUnmount():void {
  //  this.chart = null;
  //}

  shouldComponentUpdate(nextProps:Props, nextState:any, nextContext:any):boolean {
    const currentProps:Props = this.props;

    if (!this._width || !this._height
      || currentProps.width !== nextProps.width
      || currentProps.height !== nextProps.height
      || currentProps.gutterLeft !== nextProps.gutterLeft
      || currentProps.gutterRight !== nextProps.gutterRight
      || currentProps.gutterTop !== nextProps.gutterTop
      || currentProps.gutterBottom !== nextProps.gutterBottom) {
      this._svg.attr({width: nextProps.width, height: nextProps.height});

      this._width = nextProps.width - nextProps.gutterLeft - nextProps.gutterRight;
      this._height = nextProps.height - nextProps.gutterTop - nextProps.gutterBottom;

      this._g.attr('transform', `translate(${nextProps.gutterLeft}, ${nextProps.gutterTop})`);
      this._x.attr('transform', `translate(0, ${this._height})`);
      this._y.attr('transform', `translate(0, 0)`);
    }

    if (currentProps.width !== nextProps.width
      || currentProps.height !== nextProps.height
      || currentProps.gutterLeft !== nextProps.gutterLeft
      || currentProps.gutterRight !== nextProps.gutterRight
      || currentProps.gutterTop !== nextProps.gutterTop
      || currentProps.gutterBottom !== nextProps.gutterBottom
      || currentProps.color !== nextProps.color
      || currentProps.data !== nextProps.data) {
      this.draw(nextProps, currentProps.data !== nextProps.data);
    }
    return false;
  }
}

