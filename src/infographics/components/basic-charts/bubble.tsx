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
  private _bubbles:d3.Selection<any>;

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
    const xmax:number = d3.max(data, d => d.Data2);
    const ymax:number = d3.max(data, d => d.Data1);
    const zmax:number = d3.max(data, d => d.Data3);
    const xscale = d3.scale.linear().rangeRound([0, this._width]).domain([0, xmax]).nice();
    const yscale = d3.scale.linear().rangeRound([this._height, 0]).domain([0, ymax]).nice();

    // remove ramaining nodes
    if (this._bubbles) {
      (!drawTransition ? this._bubbles : this._bubbles
        .transition()
        .duration(props.duration)
        .delay((d, i) => props.delay * i)
        .ease(this._easeIn)
        .attr({
          opacity: 0,
          r: 0
        })) // end transition
        .remove()
    }

    // create additional nodes
    this._bubbles = this._g
      .selectAll('.circle')
      .data(data)
      .enter()
      .append('circle')
      .call(d3tip({
        html: (d:Data) => `<h5>${d.Category}</h5>${d.Data1}<br/>${d.Data2}<br/>${d.Data3}`
      }));

    //noinspection TypeScriptValidateTypes
    (!drawTransition ? this._bubbles : this._bubbles
      .attr({
        fill: d => props.color(d.Category),
        cx: d => xscale(d.Data2),
        cy: d => yscale(d.Data1),
        r: 0,
        opacity: 0
      })
      .transition()
      .delay((d, i) => props.delay * i)
      .ease(this._easeOut)) // end transition
      .attr({
        fill: d => props.color(d.Category),
        cx: d => xscale(d.Data2),
        cy: d => yscale(d.Data1),
        opacity: 1,
        r: d => 5 + ((d.Data3 / zmax) * 15)
      });

    // draw axis
    let xaxis = d3.svg.axis().scale(xscale).orient('bottom');
    let yaxis = d3.svg.axis().scale(yscale).orient('left');

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