import * as React from 'react';
import * as d3 from 'd3';

import {Data} from '../types';
import Bar from './basic-chart-bar';

export default class BasicCharts extends React.Component<any, any> {
  constructor(props, context) {
    super(props, context);
    this.state = {data: null};
  }

  render() {
    const style = {textAlign: 'right'};
    const colors:d3.scale.Ordinal<string, string>[] = [
      d3.scale.category10(),
      d3.scale.category20(),
      d3.scale.category20b(),
      d3.scale.category20c()
    ]
    const bars:JSX.Element[] = d3.range(50).map(x => (
      <Bar key={x} width={310} height={150} data={this.state.data} color={colors[x % colors.length]}/>
    ));
    return (
      <div>
        <div style={style}>
          <button onClick={this.refresh.bind(this)}>Refresh</button>
        </div>
        {bars}
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
    this.refresh();
  }

  refresh() {
    this.setState({
      data: this.data()
    });
  }
}