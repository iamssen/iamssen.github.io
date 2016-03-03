import * as React from 'react';
import * as d3 from 'd3';
import d3tip from 'd3tip';

import {Data} from '../../types';
import circle = d3.geo.circle;

interface Props {
  duration?:number;
  delay?:number;
  width?:number;
  height?:number;
  color?:d3.scale.Ordinal<string, string>;
  data?:Data[];
}

export default class Component extends React.Component<Props, any> {
  private _svg:d3.Selection<any>;
  private _g:d3.Selection<Data>;
  private __test_outline:d3.Selection<any>;
  private _path1:d3.Selection<any>;
  private _dot1:d3.Selection<any>;
  private _radius:number;
  private _easeOut:(t:number)=>number;
  private _easeIn:(t:number)=>number;

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
    return (<svg className="basic-chart-radar" ref="svg"/>);
  }

  draw(props:Props, drawTransition:boolean) {
    const data:Data[] = props.data;
    const data1Max:number = d3.max(data, d => d.Data1);
    const data1 = d3.scale.linear().rangeRound([0, this._radius]).domain([0, data1Max]).nice();
    const category = d3.scale.ordinal().rangeBands([0, Math.PI * 2]).domain(data.map(d => d.Category));

    this.__test_outline.attr({
      r: this._radius,
      fill: 'none',
      stroke: 'rgba(0, 0, 0, 0.3)',
      'stroke-width': 2
    });

    const points = data.map(d => ({
      x: data1(d.Data1) * Math.cos(category(d.Category)),
      y: data1(d.Data1) * Math.sin(category(d.Category)),
      color: props.color(d.Category),
      data: d
    }));

    // remove remaining dots
    if (this._dot1) {
      (!drawTransition ? this._dot1 : this._dot1
        .transition()
        .duration(props.duration)
        //.delay((d, i) => props.delay * i)
        .ease(this._easeIn)
        .attr({
          opacity: 0,
          r: 0
        })) // end transition
        .remove()
    }

    // create additional dots
    this._dot1 = this._g
      .selectAll('.circle')
      .data(points)
      .enter()
      .append('circle')
      .call(d3tip({
        html: (d:any) => `<h5>${d.data.Category}</h5>${d.data.Data1}`
      }));

    //noinspection TypeScriptValidateTypes
    (!drawTransition ? this._dot1 : this._dot1
      .attr({
        cx: p => p.x,
        cy: p => p.y,
        r: 1,
        opacity: 0,
        fill: p => p.color
      })
      .transition()
      .delay((d, i) => props.delay * i)
      .ease(this._easeOut)) // end transition
      .attr({
        cx: p => p.x,
        cy: p => p.y,
        r: 5,
        opacity: 1,
        fill: p => p.color
      });


    const line1:any = d3.svg.line()
      .x((p:any) => p.x)
      .y((p:any) => p.y)
      .interpolate('linear-closed');

    if (!this._path1) {
      const line0:any = d3.svg.line()
        .x((p:any) => 0)
        .y((p:any) => 0)
        .interpolate('linear-closed');

      this._path1 = this._g.append('path')
        .attr({
          fill: 'rgba(0, 0, 0, 0.06)',
          stroke: 'rgba(0, 0, 0, 0.6)',
          'stroke-width': '2px'
        });

      //noinspection TypeScriptValidateTypes
      (!drawTransition ? this._path1.datum(points) : this._path1.datum(points)
        .attr('d', line0)
        .transition()) // end transition
        .attr('d', line1);
    } else {
      //noinspection TypeScriptValidateTypes
      (!drawTransition ? this._path1.datum(points) : this._path1.datum(points)
        .transition()) // end transition
        .attr('d', line1);
    }
  }

  componentDidMount():void {
    this._svg = d3.select(this.refs['svg'] as Element);
    this._g = this._svg.append('g');
    this.__test_outline = this._svg.append('circle');
    this._easeIn = d3.ease('quad-in');
    this._easeOut = d3.ease('quad-out');
  }

  shouldComponentUpdate(nextProps:Props, nextState:any, nextContext:any):boolean {
    const currentProps:Props = this.props;

    if (!this._svg.attr('width')
      || currentProps.width !== nextProps.width
      || currentProps.height !== nextProps.height) {
      this._svg.attr({width: nextProps.width, height: nextProps.height});

      this._radius = Math.floor(d3.min([nextProps.width, nextProps.height]) / 2);

      this._g.attr('transform', `translate(${nextProps.width / 2}, ${nextProps.height / 2})`);
      this.__test_outline.attr('transform', `translate(${nextProps.width / 2}, ${nextProps.height / 2})`);
    }

    if (currentProps.width !== nextProps.width
      || currentProps.height !== nextProps.height
      || currentProps.color !== nextProps.color
      || currentProps.data !== nextProps.data) {
      this.draw(nextProps, currentProps.data !== nextProps.data);
    }
    return false;
  }
}