import * as React from 'react';
import * as d3 from 'd3';
import d3tip from 'd3tip';

import {Data} from '../../types';

const CHART:string = 'chart';
const COLUMN_SERIES:string = 'canvas';
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
      <svg ref={CHART} className="basic-chart-column">
        <g ref={COLUMN_SERIES} className="canvas"/>
        <g ref={AXIS_X} className="axis axis-x"/>
        <g ref={AXIS_Y} className="axis axis-y"/>
      </svg>
    );
  }
  
  drawColumnSeries(props:Props, drawTransition:boolean,
                   dataField:string,
                   categoryField:string,
                   dataScale:d3.scale.Linear<any, any>,
                   categoryScale:d3.scale.Ordinal<any, any>,
                   updateSelection:d3.selection.Update<any>) {
    //noinspection TypeScriptValidateTypes
    (!drawTransition ? updateSelection : updateSelection
      .transition()
      .duration(props.duration)
      .delay((d, i) => props.delay * i)
      .ease(this._easeOut)) // end transition
      .attr({
        fill: d => props.color(d[categoryField]),
        x: d => categoryScale(d[categoryField]),
        y: d => dataScale(d[dataField]),
        width: d => categoryScale.rangeBand(),
        height: d => this._h - dataScale(d[dataField])
      });

    (!drawTransition ? updateSelection.exit() : updateSelection.exit()
      .transition()
      .duration(props.duration)
      .delay((d, i) => props.delay * i)
      .ease(this._easeIn)
      .attr({
        opacity: 0,
        x: props.width,
        y: this._h,
        width: 0,
        height: 0
      })) // end transition
      .remove();

    const newRects:d3.Selection<any> = updateSelection.enter()
      .append('rect')
      .call(d3tip({
        html: (d:Data) => `<h5>${d[categoryField]}</h5>${d[dataField]}`
      }));

    //noinspection TypeScriptValidateTypes
    (!drawTransition ? newRects : newRects
      .attr({
        fill: d => props.color(d[categoryField]),
        opacity: 0,
        x: d => categoryScale(d[categoryField]),
        y: this._h,
        width: d => categoryScale.rangeBand(),
        height: 0
      })
      .transition()
      .duration(props.duration)
      .delay((d, i) => props.delay * i)
      .ease(this._easeOut)) // end transition
      .attr({
        fill: d => props.color(d[categoryField]),
        opacity: 1,
        x: d => categoryScale(d[categoryField]),
        y: d => dataScale(d[dataField]),
        width: d => categoryScale.rangeBand(),
        height: d => this._h - dataScale(d[dataField])
      });
  }
  
  draw(props:Props, drawTransition:boolean) {
    const data:Data[] = props.data;
    const categoryScale:d3.scale.Ordinal<any, any> = d3.scale.ordinal().rangeRoundBands([0, this._w]).domain(data.map(d => d.Category));
    
    const data1Max:number = d3.max(data, d => d.Data1);
    const data1Scale:d3.scale.Linear<any, any> = d3.scale.linear().rangeRound([this._h, 0]).domain([0, data1Max]).nice();
    const data1ColumnSelection:d3.selection.Update<any> = this.select(COLUMN_SERIES).selectAll('rect').data(data);
    
    // draw column series
    this.drawColumnSeries(props, drawTransition, 'Data1', 'Category', data1Scale, categoryScale, data1ColumnSelection);
    
    // draw axis
    const xaxis = d3.svg.axis().scale(categoryScale).orient('bottom');
    const yaxis = d3.svg.axis().scale(data1Scale).orient('left');
    
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
      
      this.select(COLUMN_SERIES).attr('transform', `translate(${nextProps.gutterLeft}, ${nextProps.gutterTop})`);
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