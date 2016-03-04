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
  dataFields?:string[];
}

export default class Component extends React.Component<Props, any> {
  private _w:number;
  private _h:number;
  private _easeOut:(t:number)=>number;
  private _easeIn:(t:number)=>number;
  
  static defaultProps:Props = {
    duration: 300,
    delay: 20,
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
      <svg ref={CHART} className="basic-chart-bar">
        <g ref={SERIES} className="series"/>
        <g ref={AXIS_X} className="axis axis-x"/>
        <g ref={AXIS_Y} className="axis axis-y"/>
      </svg>
    );
  }

  draw(props:Props, drawTransition:boolean) {
    const {data, duration, delay: delayTime, color, dataFields} = props;
    const categoryField:string = 'Category';
    const categoryScale:d3.scale.Ordinal<any, any> = d3.scale.ordinal().rangeRoundBands([0, this._h]).domain(data.map(d => d[categoryField]));

    const xmax:number = d3.max(data, d => d3.max(dataFields, dataField => d[dataField]));
    const xscale:d3.scale.Linear<any, any> = d3.scale.linear().rangeRound([0, this._w]).domain([0, xmax]).nice();

    //---------------------------------------------
    // draw bar series
    //---------------------------------------------
    interface Rect {
      delay: number;
      fill: string;
      y: number;
      width: number;
      height: number;
      data:Data;
      dataField:string;
    }

    const dataFieldsLength:number = dataFields.length;
    const rects:Rect[][] = data.map((d, f) => dataFields.map((dataField, s) => {
      const fill:string = dataFieldsLength === 1 ? color(d[categoryField]) : color(s.toString());
      const delay:number = delayTime * f;
      const width:number = xscale(d[dataField]);
      const height:number = categoryScale.rangeBand() / dataFieldsLength;
      const y:number = categoryScale(d[categoryField]) + (height * s);
      return {fill, delay, width, height, y, data: d, dataField};
    }));

    const delay = (r:Rect) => r.delay;
    const fill = (r:Rect) => r.fill;
    const y = (r:Rect) => r.y;
    const width = (r:Rect) => r.width;
    const height = (r:Rect) => r.height;

    const update:d3.selection.Update<any> = this.select(SERIES)
      .selectAll('rect')
      .data([].concat(...rects));

    // noinspection TypeScriptValidateTypes
    (!drawTransition ? update : update
      .transition()
      .duration(duration)
      .delay(delay)
      .ease(this._easeOut)) // end transition
      .attr({
        opacity: 1,
        fill, y, width, height
      });

    (!drawTransition ? update.exit() : update.exit()
      .transition()
      .duration(duration)
      .delay(delay)
      .ease(this._easeIn)
      .attr({
        opacity: 0,
        y: this._h,
        width: 0,
        height: 0
      })) // end transition
      .remove();

    const enter:d3.Selection<any> = update.enter()
      .append('rect')
      .attr({fill, y, height})
      .call(d3tip({
        html: (r:Rect) => `<h5>${r.data[categoryField]}</h5>${r.data[r.dataField]}`
      }));

    //noinspection TypeScriptValidateTypes
    (!drawTransition ? enter : enter
      .attr({
        opacity: 0,
        width: 0
      })
      .transition()
      .duration(duration)
      .delay(delay)
      .ease(this._easeOut)) // end transition
      .attr({
        opacity: 1,
        width
      });

    //---------------------------------------------
    // draw axis
    //---------------------------------------------
    const xaxis = d3.svg.axis().scale(xscale).orient('bottom');
    const yaxis = d3.svg.axis().scale(categoryScale).orient('left');
    
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
      || currentProps.data !== nextProps.data
      || currentProps.dataFields !== nextProps.dataFields) {
      this.draw(nextProps, currentProps.data !== nextProps.data || currentProps.dataFields !== nextProps.dataFields);
    }
    return false;
  }

  select(ref:string):d3.Selection<any> {
    return d3.select(this.refs[ref] as Element);
  }
}