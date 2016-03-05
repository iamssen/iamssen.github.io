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
  categoryField?:string;
}

export default class Component extends React.Component<Props, any> {
  private _w:number;
  private _h:number;
  private _easeOut:(t:number)=>number;
  private _easeIn:(t:number)=>number;
  private _paths:d3.Selection<any>;

  static defaultProps:Props = {
    duration: 700,
    delay: 300,
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
        <g ref={SERIES} className="series"/>
        <g ref={AXIS_X} className="axis axis-x"/>
        <g ref={AXIS_Y} className="axis axis-y"/>
      </svg>
    );
  }

  draw(props:Props, drawTransition:boolean) {
    const {data, duration, delay: delayTime, color: colorScale, dataFields, categoryField} = props;
    const categoryScale:d3.scale.Ordinal<any, any> = d3.scale.ordinal().rangeRoundBands([0, this._w]).domain(data.map(d => d[categoryField]));

    const ymax:number = d3.max(data, d => d3.max(dataFields, dataField => d[dataField]));
    const yscale:d3.scale.Linear<any, any> = d3.scale.linear().rangeRound([this._h, 0]).domain([0, ymax]).nice();

    //---------------------------------------------
    // draw line series
    //---------------------------------------------
    interface Path {
      delay:number;
      color:string;
      path:string;
      dataField:string;
      offset:number;
    }

    const line = d3.svg.line()
      .x(d => categoryScale(d[categoryField]) + (categoryScale.rangeBand() / 2));

    const paths:Path[] = dataFields.map((dataField, s) => {
      const path:string = line.y(d => yscale(d[dataField]))(data);
      const delay:number = delayTime * s;
      const color:string = colorScale(dataField);
      return {delay, path, color, dataField};
    });

    const delay = (l:Path) => l.delay;
    const color = (l:Path) => l.color;
    const path = (l:Path) => l.path;
    const offset = (l:Path) => l.offset;

    if (this._paths) {
      (!drawTransition ? this._paths : this._paths
        .transition()
        .duration(duration / 3)
        .delay(delay)
        .ease(this._easeIn)
        .attr({
          opacity: 0
        })) // end transition
        .remove();
    }

    this._paths = this.select(SERIES)
      .selectAll('.path')
      .data(paths)
      .enter()
      .append('path')
      .attr({
        d: path,
        fill: 'none',
        stroke: color,
        'stroke-width': 4,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
      .each(function (l:Path) {
        l.offset = this.getTotalLength();
      });

    //noinspection TypeScriptValidateTypes
    (!drawTransition ? this._paths : this._paths
      .attr({
        opacity: 0,
        'stroke-dasharray': offset,
        'stroke-dashoffset': offset
      })
      .transition()
      .duration(duration)
      .delay(delay)
      .ease(this._easeOut)) // end transition
      .attr({
        opacity: 1,
        'stroke-dasharray': offset,
        'stroke-dashoffset': 0
      });

    //---------------------------------------------
    // draw axis
    //---------------------------------------------
    const xaxis = d3.svg.axis().scale(categoryScale).orient('bottom');
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
    const width = currentProps.width !== nextProps.width;
    const height = currentProps.height !== nextProps.height;
    const gutterLeft = currentProps.gutterLeft !== nextProps.gutterLeft;
    const gutterRight = currentProps.gutterRight !== nextProps.gutterRight;
    const gutterTop = currentProps.gutterTop !== nextProps.gutterTop;
    const gutterBottom = currentProps.gutterBottom !== nextProps.gutterBottom;
    const color = currentProps.color !== nextProps.color;
    const data = currentProps.data !== nextProps.data;
    const dataFields = currentProps.dataFields !== nextProps.dataFields;
    const categoryField = currentProps.categoryField !== nextProps.categoryField;

    if (!this._w || !this._h
      || width
      || height
      || gutterLeft
      || gutterRight
      || gutterTop
      || gutterBottom) {
      this.select(CHART).attr({width: nextProps.width, height: nextProps.height});

      this._w = nextProps.width - nextProps.gutterLeft - nextProps.gutterRight;
      this._h = nextProps.height - nextProps.gutterTop - nextProps.gutterBottom;

      this.select(SERIES).attr('transform', `translate(${nextProps.gutterLeft}, ${nextProps.gutterTop})`);
      this.select(AXIS_X).attr('transform', `translate(${nextProps.gutterLeft}, ${nextProps.gutterTop + this._h})`);
      this.select(AXIS_Y).attr('transform', `translate(${nextProps.gutterLeft}, ${nextProps.gutterTop})`);
    }

    if (width
      || height
      || gutterLeft
      || gutterRight
      || gutterTop
      || gutterBottom
      || color
      || data
      || dataFields
      || categoryField) {
      this.draw(nextProps,
        data
        || dataFields
        || categoryField);
    }
    return false;
  }

  select(ref:string):d3.Selection<any> {
    return d3.select(this.refs[ref] as Element);
  }
}

