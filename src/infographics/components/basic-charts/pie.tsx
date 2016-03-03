import * as React from 'react';
import * as d3 from 'd3';
import d3tip from 'd3tip';

import {Data} from '../../types';

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
  private _pie:d3.layout.Pie<any>;
  private _arc:d3.svg.Arc<any>;
  private _radius:number;
  private _easeOut:(t:number)=>number;
  private _easeIn:(t:number)=>number;
  private _prev:d3.Selection<any>;

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
    return (<svg className="basic-chart-bubble" ref="svg"/>);
  }

  draw(props:Props, drawTransition:boolean) {
    const data:Data[] = props.data;
    const pieData = this._pie(data);
    const arc = this._arc;

    if (this._prev) {
      (!drawTransition ? this._prev : this._prev
        .transition()
        .duration(props.duration)
        .tween('exit arc', function () {
          const selection = d3.select(this);
          return (t:number) => {
            const r:number = 1 - t;
            const a:number = (Math.PI * 2) - (Math.PI * 2 * r);
            selection.attr('d', (d, i) => {
              let start = (d.startAngle * r) + a;
              let end = (d.endAngle * r) + a;
              return arc.startAngle(start).endAngle(end)(d, i);
            })
          }
        })) // end transition
        .remove();
    }

    const path:d3.Selection<any> = this._g
      .selectAll('.path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('fill', (d) => props.color(d.data.Category))
      .call(d3tip({
        html: (d:{data:Data}) => `<h5>${d.data.Category}</h5>${d.data.Data1}`
      }));

    if (drawTransition) {
      path
        .transition()
        .duration(props.duration)
        .tween('entry arc', function () {
          const selection:d3.Selection<any> = d3.select(this);
          return (t:number) => {
            selection.attr('d', (d, i) => {
              const start:number = d.startAngle * t;
              const end:number = d.endAngle * t;
              return arc.startAngle(start).endAngle(end)(d, i);
            })
          }
        });
    } else {
      path.attr('d', (d, i) => arc.startAngle(d.startAngle).endAngle(d.endAngle)(d, i));
    }

    this._prev = path;
  }

  componentDidMount():void {
    this._svg = d3.select(this.refs['svg'] as Element);
    this._g = this._svg.append('g');
    this._easeIn = d3.ease('quad-in');
    this._easeOut = d3.ease('quad-out');
  }

  //componentWillUnmount():void {
  //  this.chart = null;
  //}

  shouldComponentUpdate(nextProps:Props, nextState:any, nextContext:any):boolean {
    const currentProps:Props = this.props;

    if (!this._svg.attr('width')
      || currentProps.width !== nextProps.width
      || currentProps.height !== nextProps.height) {
      this._svg.attr({width: nextProps.width, height: nextProps.height});

      this._radius = Math.floor(d3.min([nextProps.width, nextProps.height]) / 2);
      this._pie = d3.layout.pie().value((d:any) => d.Data1).sort(null);
      this._arc = d3.svg.arc().outerRadius(this._radius - 20).innerRadius(this._radius - 60);

      this._g.attr('transform', `translate(${nextProps.width / 2}, ${nextProps.height / 2})`);
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