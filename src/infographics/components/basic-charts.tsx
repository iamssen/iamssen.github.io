import * as React from 'react';
import * as d3 from 'd3';

import {Data} from '../types';

import Bar from './basic-charts/bar';
import Column from './basic-charts/column';
import Bubble from './basic-charts/bubble';
import Line from './basic-charts/line';
import Pie from './basic-charts/pie';

import './basic-charts.less';

const colors:d3.scale.Ordinal<string, string>[] = [
  d3.scale.category10(),
  d3.scale.category20(),
  d3.scale.category20b(),
  d3.scale.category20c()
];

export default class BasicCharts extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
    this.state = {data: null, color: colors[0]};
  }

  render() {
    const style = {textAlign: 'right'};
    return (
      <div className="basic-charts">
        <div style={style}>
          <button onClick={this.changeColor.bind(this)}>Change Color</button>
          <button onClick={this.refreshData.bind(this)}>Refresh Data</button>
        </div>
        <Bar width={450} height={270} data={this.state.data} color={this.state.color}/>
        <Bubble width={450} height={270} data={this.state.data} color={this.state.color}/>
        <Column width={450} height={270} data={this.state.data} color={this.state.color}/>
        <Line width={450} height={270} data={this.state.data} color={this.state.color}/>
        <Pie width={450} height={270} data={this.state.data} color={this.state.color}/>
      </div>
    )
  }

  data():Data[] {
    let max:number = Math.random() * 1000;
    let arr = [];
    let f:number = -1;
    let fmax:number = 5 + (Math.random() * 10);
    while (++f < fmax) {
      arr.push({
        Category: 1980 + f,
        Data1: Math.random() * max,
        Data2: Math.random() * max,
        Data3: Math.random() * max,
        Data4: Math.random() * max
      })
    }
    return arr;
  }

  componentDidMount():void {
    this.refreshData();
  }

  refreshData() {
    this.setState({
      data: this.data()
    });
  }

  changeColor() {
    this.setState({
      color: colors[(colors.indexOf(this.state.color) + 1) % colors.length]
    });
  }
}