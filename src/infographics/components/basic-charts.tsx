import * as React from 'react';
import * as d3 from 'd3';

import {Data} from '../types';

import Bar from './basic-charts/bar';
import Column from './basic-charts/column';
import Bubble from './basic-charts/bubble';
import Line from './basic-charts/line';
import Pie from './basic-charts/pie';
import Radar from './basic-charts/radar';

import './basic-charts.less';

const colors:d3.scale.Ordinal<string, string>[] = [
  d3.scale.category10(),
  d3.scale.category20(),
  d3.scale.category20b(),
  d3.scale.category20c()
];

const sizes:[number, number][] = [
  [540, 320],
  [450, 270],
  [400, 240]
];

const dataFields:string[][] = [
  ['Data1'],
  ['Data1', 'Data2'],
  ['Data1', 'Data2', 'Data3'],
  ['Data1', 'Data2', 'Data3', 'Data4']
];

export default class BasicCharts extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
    this.state = {data: null, color: colors[0], size: sizes[0], dataField: dataFields[0]};
  }

  render() {
    const style = {textAlign: 'right'};
    const {data, color, dataField, size} = this.state;
    const [width, height] = size;

    return (
      <div className="basic-charts">
        <div style={style}>
          <button onClick={this.changeSize.bind(this)}>Change Size</button>
          <button onClick={this.changeColor.bind(this)}>Change Color</button>
          <button onClick={this.changeDataFields.bind(this)}>Change DataFields</button>
          <button onClick={this.refreshData.bind(this)}>Refresh Data</button>
        </div>
        <Bar width={width} height={height} data={data} color={color} dataFields={dataField}/>
        <Bubble width={width} height={height} data={data} color={color} xField="Data2" yField="Data1" rField="Data3" categoryField="Category"/>
        <Column width={width} height={height} data={data} color={color} dataFields={dataField}/>
        <Line width={width} height={height} data={data} color={color}/>
        <Pie width={width} height={height} data={data} color={color}/>
        <Radar width={width} height={height} data={data} color={color}/>
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

  changeSize() {
    this.setState({
      size: sizes[(sizes.indexOf(this.state.size) + 1) % sizes.length]
    });
  }

  changeDataFields() {
    this.setState({
      dataField: dataFields[(dataFields.indexOf(this.state.dataField) + 1) % dataFields.length]
    })
  }
}