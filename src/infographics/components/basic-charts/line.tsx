import * as React from 'react';
import * as d3 from 'd3';
import d3tip from 'd3tip';

import {Data} from '../../types';

const CHART:string = 'chart';
const BAR_SERIES:string = 'canvas';
const LINE_SERIES1:string = 'line1';
const LINE_SERIES2:string = 'line2';
const LINE_SERIES3:string = 'line3';
const LINE_SERIES4:string = 'line4';
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
      <svg ref={CHART} className="basic-chart-line">
        <g ref={BAR_SERIES} className="canvas">
          <path ref={LINE_SERIES1} className="line1"/>
          <path ref={LINE_SERIES2} className="line2"/>
          <path ref={LINE_SERIES3} className="line3"/>
          <path ref={LINE_SERIES4} className="line4"/>
        </g>
        <g ref={AXIS_X} className="axis axis-x"/>
        <g ref={AXIS_Y} className="axis axis-y"/>
      </svg>
    );
  }

  drawLineSeries(props:Props, drawTransition:boolean,
                 dataField:string,
                 categoryField:string,
                 dataScale:d3.scale.Linear<any, any>,
                 categoryScale:d3.scale.Ordinal<any, any>,
                 ref:string) {
    const path = this.select(ref);

    const line:any = d3.svg.line()
      .x((d:any, i) => categoryScale(d[categoryField]) + (categoryScale.rangeBand() / 2))
      .y((d:any, i) => dataScale(d[dataField]));

    //noinspection TypeScriptValidateTypes
    (!drawTransition ? path.datum(props.data) : path.datum(props.data)
      .transition())
      .attr({
        d: line,
        fill: 'none',
        stroke: props.color(ref),
        'stroke-width': '4px',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      });
  }

  draw(props:Props, drawTransition:boolean) {
    const data:Data[] = props.data;
    const categoryScale:d3.scale.Ordinal<any, any> = d3.scale.ordinal().rangeRoundBands([0, this._w]).domain(data.map(d => d.Category));

    const dataMax:number = Math.max(
      d3.max(data, d => d.Data1),
      d3.max(data, d => d.Data2),
      d3.max(data, d => d.Data3),
      d3.max(data, d => d.Data4)
    );
    const dataScale:d3.scale.Linear<any, any> = d3.scale.linear().rangeRound([this._h, 0]).domain([0, dataMax]).nice();

    this.drawLineSeries(props, drawTransition, 'Data1', 'Category', dataScale, categoryScale, LINE_SERIES1);
    this.drawLineSeries(props, drawTransition, 'Data2', 'Category', dataScale, categoryScale, LINE_SERIES2);
    this.drawLineSeries(props, drawTransition, 'Data3', 'Category', dataScale, categoryScale, LINE_SERIES3);
    this.drawLineSeries(props, drawTransition, 'Data4', 'Category', dataScale, categoryScale, LINE_SERIES4);

    // draw axis
    const xaxis = d3.svg.axis().scale(categoryScale).orient('bottom');
    const yaxis = d3.svg.axis().scale(dataScale).orient('left');

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

      this.select(BAR_SERIES).attr('transform', `translate(${nextProps.gutterLeft}, ${nextProps.gutterTop})`);
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

