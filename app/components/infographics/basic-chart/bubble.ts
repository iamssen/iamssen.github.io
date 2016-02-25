import d3tip from 'd3tip';
import {Data} from './data';

export class BubbleChart {
  duration:number = 300;
  delay:number = 40;
  width:number;
  height:number;
  color:d3.scale.Ordinal<string, string>;
  g:d3.Selection<Data>;
  x:d3.Selection<any>;
  y:d3.Selection<any>;
  easeOut:(t:number)=>number;
  easeIn:(t:number)=>number;
  prev:d3.Selection;

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
    let xmax:number = d3.max(data, d => d.Data2);
    let ymax:number = d3.max(data, d => d.Data1);
    let zmax:number = d3.max(data, d => d.Data3);
    let xscale = d3.scale.linear().rangeRound([0, this.width]).domain([0, xmax]).nice();
    let yscale = d3.scale.linear().rangeRound([this.height, 0]).domain([0, ymax]).nice();

    // remove ramaining nodes
    if (this.prev) {
      this.prev
        .transition()
        .duration(this.duration)
        .delay((d, i) => this.delay * i)
        .ease(this.easeIn)
        .attr({
          opacity: 0,
          r: 0
        })
        .remove()
    }

    // create additional nodes
    this.prev = this.g
      .selectAll('.circle')
      .data(data)
      .enter()
      .append('circle')
      .attr({
        fill: d => this.color(d.Category),
        cx: d => xscale(d.Data2),
        cy: d => yscale(d.Data1),
        r: 0,
        opacity: 0
      })
      .call(d3tip({
        html: d => `<h5>${d.Category}</h5>${d.Data1}<br/>${d.Data2}<br/>${d.Data3}`
      }))

    this.prev
      .transition()
      .delay((d, i) => this.delay * i)
      .ease(this.easeOut)
      .attr({
        opacity: 1,
        r: d => 5 + ((d.Data3 / zmax) * 15)
      })

    // draw axis
    let xaxis = d3.svg.axis().scale(xscale).orient('bottom');
    let yaxis = d3.svg.axis().scale(yscale).orient('left');

    this.x.call(xaxis);
    this.y.call(yaxis);
  }
}