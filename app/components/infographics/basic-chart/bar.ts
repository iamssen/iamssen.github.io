import d3tip from 'd3tip';
import {Data} from './data';

export class BarChart {
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
    this.x = this.g.append('g').attr('transform', `translate(0, 0)`);
    this.y = this.g.append('g').attr('transform', `translate(0, ${this.height})`);
    this.easeIn = d3.ease('quad-in');
    this.easeOut = d3.ease('quad-out');
  }

  update(data:Data[]) {
    let xmax:number = d3.max(data, d => d.Data1);
    let xscale = d3.scale.linear().rangeRound([0, this.width]).domain([0, xmax]).nice();
    let yscale = d3.scale.ordinal().rangeRoundBands([0, this.height]).domain(data.map(d => d.Category));
    let rects = this.g.selectAll('rect').data(data);

    // update existing nodes
    rects
      .transition()
      .duration(this.duration)
      .delay((d, i) => this.delay * i)
      .ease(this.easeOut)
      .attr({
        fill: d => this.color(d.Category),
        y: d => yscale(d.Category),
        width: d => xscale(d.Data1),
        height: d => yscale.rangeBand()
      })

    // remove ramaining nodes
    rects
      .exit()
      .transition()
      .duration(this.duration)
      .delay((d, i) => this.delay * i)
      .ease(this.easeIn)
      .attr({
        opacity: 0,
        y: this.height,
        width: 0,
        height: 0
      })
      .remove()

    // create additional nodes
    rects
      .enter()
      .append('rect')
      .attr({
        fill: d => this.color(d.Category),
        opacity: 0,
        y: d => yscale(d.Category),
        width: 0,
        height: d => yscale.rangeBand()
      })
      .call(d3tip({
        html: d => `<h5>${d.Category}</h5>${d.Data1}`
      }))
      .transition()
      .duration(this.duration)
      .delay((d, i) => this.delay * i)
      .ease(this.easeOut)
      .attr({
        opacity: 1,
        width: d => xscale(d.Data1)
      })

    // draw axis
    let xaxis = d3.svg.axis().scale(xscale).orient('bottom');
    let yaxis = d3.svg.axis().scale(yscale).orient('left');

    this.y.call(xaxis);
    this.x.call(yaxis);
  }
}

