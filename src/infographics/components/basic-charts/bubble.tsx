import * as React from 'react';
import * as d3 from 'd3';
import d3tip from 'd3tip';

import {Data} from '../../types';

const CHART:string = 'chart';
const BUBBLE_SERIES:string = 'canvas';
const AXIS_X:string = 'axisX';
const AXIS_Y:string = 'axisY';

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
  private _w:number;
  private _h:number;
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
    return (
    <svg ref={CHART} className="basic-chart-bubble">
      <g ref={BUBBLE_SERIES} className="canvas"/>
      <g ref={AXIS_X} className="axis axis-x"/>
      <g ref={AXIS_Y} className="axis axis-y"/>
    </svg>
    );
  }

  draw(props:Props, drawTransition:boolean) {
    const data:Data[] = props.data;
    const xmax:number = d3.max(data, d => d.Data2);
    const ymax:number = d3.max(data, d => d.Data1);
    const rmax:number = d3.max(data, d => d.Data3);
    const xscale = d3.scale.linear().rangeRound([0, this._w]).domain([0, xmax]).nice();
    const yscale = d3.scale.linear().rangeRound([this._h, 0]).domain([0, ymax]).nice();
    const rscale = d3.scale.linear().rangeRound([5, 20]).domain([0, rmax]).nice();

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
    this._bubbles = this.select(BUBBLE_SERIES)
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
        r: d => rscale(d.Data3),
        opacity: 1
      });

    // draw axis
    const xaxis = d3.svg.axis().scale(xscale).orient('bottom');
    const yaxis = d3.svg.axis().scale(yscale).orient('left');

    this.select(AXIS_X).call(xaxis);
    this.select(AXIS_Y).call(yaxis);
  }

  componentDidMount():void {
    this._easeIn = d3.ease('quad-in');
    this._easeOut = d3.ease('quad-out');
  }

  //componentWillUnmount():void {
  //  this.chart = null;
  //}

  shouldComponentUpdate(nextProps:Props, nextState:any, nextContext:any):boolean {
    const currentProps:Props = this.props;

    if (!this._w || !this._h
      || currentProps.width !== nextProps.width
      || currentProps.height !== nextProps.height
      || currentProps.gutterLeft !== nextProps.gutterLeft
      || currentProps.gutterRight !== nextProps.gutterRight
      || currentProps.gutterTop !== nextProps.gutterTop
      || currentProps.gutterBottom !== nextProps.gutterBottom) {
      this.select(CHART).attr({width: nextProps.width, height: nextProps.height});

      this._w = nextProps.width - nextProps.gutterLeft - nextProps.gutterRight;
      this._h = nextProps.height - nextProps.gutterTop - nextProps.gutterBottom;

      this.select(BUBBLE_SERIES).attr('transform', `translate(${nextProps.gutterLeft}, ${nextProps.gutterTop})`);
      this.select(AXIS_X).attr('transform', `translate(${nextProps.gutterLeft}, ${nextProps.gutterTop + this._h})`);
      this.select(AXIS_Y).attr('transform', `translate(${nextProps.gutterLeft}, ${nextProps.gutterTop})`);
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

  select(ref:string):d3.Selection<any> {
    return d3.select(this.refs[ref] as Element);
  }
}