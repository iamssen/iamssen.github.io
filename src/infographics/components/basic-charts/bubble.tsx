import * as React from 'react';
import * as d3 from 'd3';
import d3tip from 'd3tip';

import {Data} from '../../types';

const CHART:string = 'chart';
const SERIES:string = 'series';
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
  xField?:string;
  yField?:string;
  rField?:string;
  categoryField?:string;
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
        <g ref={SERIES} className="series"/>
        <g ref={AXIS_X} className="axis axis-x"/>
        <g ref={AXIS_Y} className="axis axis-y"/>
      </svg>
    );
  }

  draw(props:Props, drawTransition:boolean) {
    const {data, duration, delay: delayTime, color: colorScale, xField, yField, rField, categoryField} = props;

    const xmax:number = d3.max(data, d => d[xField]);
    const ymax:number = d3.max(data, d => d[yField]);
    const rmin:number = d3.min(data, d => d[rField]);
    const rmax:number = d3.max(data, d => d[rField]);
    const xscale = d3.scale.linear().rangeRound([0, this._w]).domain([0, xmax]).nice();
    const yscale = d3.scale.linear().rangeRound([this._h, 0]).domain([0, ymax]).nice();
    const rscale = d3.scale.linear().rangeRound([3, 14]).domain([rmin, rmax]).nice();
    const strokeWidthScale = d3.scale.linear().range([2, 6]).domain([3, 14]);

    //---------------------------------------------
    // draw bubble series
    //---------------------------------------------
    interface Circle {
      delay:number;
      color:string;
      x:number;
      y:number;
      r:number;
      data:Data;
    }

    const circles:Circle[] = data.map((d, f) => {
      const delay:number = delayTime * f;
      const color:string = colorScale(d[categoryField]);
      const x:number = xscale(d[xField]);
      const y:number = yscale(d[yField]);
      const r:number = rscale(d[rField]);
      return {delay, color, x, y, r, data: d};
    });

    const delay = (c:Circle) => c.delay;
    const color = (c:Circle) => c.color;
    const x = (c:Circle) => c.x;
    const y = (c:Circle) => c.y;
    const r = (c:Circle) => c.r;
    const strokeWidth = (c:Circle) => strokeWidthScale(c.r);

    if (this._bubbles) {
      (!drawTransition ? this._bubbles : this._bubbles
        .transition()
        .duration(duration)
        .delay(delay)
        .ease(this._easeIn)
        .attr({
          opacity: 0,
          r: 0
        })) // end transition
        .remove()
    }

    this._bubbles = this.select(SERIES)
      .selectAll('.circle')
      .data(circles)
      .enter()
      .append('circle')
      .attr({
        stroke: color,
        'stroke-width': strokeWidth,
        fill: 'rgba(0, 0, 0, 0)',
        cx: x,
        cy: y
      })
      .call(d3tip({
        html: (c:Circle) => `<h5>${c.data[categoryField]}</h5>
        x: ${c.data[xField]}<br/>
        y: ${c.data[yField]}<br/>
        r: ${c.data[rField]}`
      }));

    //noinspection TypeScriptValidateTypes
    (!drawTransition ? this._bubbles : this._bubbles
      .attr({
        r: 0,
        opacity: 0
      })
      .transition()
      .delay(delay)
      .ease(this._easeOut)) // end transition
      .attr({
        r,
        opacity: 1
      });

    //---------------------------------------------
    // draw axis
    //---------------------------------------------
    const xaxis = d3.svg.axis().scale(xscale).orient('bottom');
    const yaxis = d3.svg.axis().scale(yscale).orient('left');

    this.select(AXIS_X).call(xaxis);
    this.select(AXIS_Y).call(yaxis);
  }

  componentDidMount():void {
    this._easeIn = d3.ease('quad-in');
    this._easeOut = d3.ease('quad-out');
  }

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

      this.select(SERIES).attr('transform', `translate(${nextProps.gutterLeft}, ${nextProps.gutterTop})`);
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
      this.draw(nextProps,
        currentProps.data !== nextProps.data
        || currentProps.xField !== nextProps.xField
        || currentProps.yField !== nextProps.yField
        || currentProps.rField !== nextProps.rField
        || currentProps.categoryField !== nextProps.categoryField);
    }
    return false;
  }

  select(ref:string):d3.Selection<any> {
    return d3.select(this.refs[ref] as Element);
  }
}