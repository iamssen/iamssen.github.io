import d3tip from 'd3tip';
import {Data} from './data';

export class LineChart {
  duration:number = 300;
  width:number;
  height:number;
  color:d3.scale.Ordinal<string, string>;
  g:d3.Selection<Data>;
  x:d3.Selection<any>;
  y:d3.Selection<any>;
  easeOut:(t:number)=>number;
  easeIn:(t:number)=>number;
  path1:d3.Selection<any>;

  constructor(private svg:d3.Selection<any>,
              private WIDTH:number,
              private HEIGHT:number,
              private MARGIN:{LEFT:number, RIGHT:number, TOP:number, BOTTOM:number}) {
    this.color = d3.scale.category20c();
    this.width = this.WIDTH - this.MARGIN.LEFT - this.MARGIN.RIGHT;
    this.height = this.HEIGHT - this.MARGIN.TOP - this.MARGIN.BOTTOM;

    this.svg.attr({
      width: WIDTH,
      height: HEIGHT
    })

    this.g = this.svg.append('g').attr('transform', `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);
    this.x = this.g.append('g').attr('transform', `translate(0, ${this.height})`);
    this.y = this.g.append('g').attr('transform', `translate(0, 0)`);
    this.easeIn = d3.ease('quad-in');
    this.easeOut = d3.ease('quad-out');
  }

  update(data:Data[]) {
    let ymax:number = d3.max(data, d => d.Data1);
    let xscale = d3.scale.ordinal().rangeRoundBands([0, this.width]).domain(data.map(d => d.Category));
    let yscale = d3.scale.linear().rangeRound([this.height, 0]).domain([0, ymax]).nice();

    let line1 = d3.svg.line()
      .x((d, i) => xscale(d.Category) + (xscale.rangeBand() / 2))
      .y((d, i) => yscale(d.Data1));

    if (!this.path1) {
      let line0 = d3.svg.line()
        .x((d, i) => xscale(d.Category) + (xscale.rangeBand() / 2))
        .y((d, i) => yscale.range()[0]);

      this.path1 = this.g
        .append('path')
        .attr({
          fill: 'none',
          stroke: this.color('line1'),
          'stroke-width': '4px',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round'
        })

      this.path1
        .datum(data)
        .attr('d', line0)
        .transition()
        .attr('d', line1)
    } else {
      this.path1
        .datum(data)
        .transition()
        .attr('d', line1)
    }

    // draw axis
    let xaxis = d3.svg.axis().scale(xscale).orient('bottom');
    let yaxis = d3.svg.axis().scale(yscale).orient('left');

    this.x.call(xaxis);
    this.y.call(yaxis);
  }
}