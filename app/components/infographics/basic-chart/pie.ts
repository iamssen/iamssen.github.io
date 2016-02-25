import d3tip from 'd3tip';
import {Data} from './data';

export class PieChart {
  duration:number = 300;
  color:d3.scale.Ordinal<string, string>;
  g:d3.Selection<Data>;
  pie:d3.layout.Pie;
  arc:d3.svg.Arc;
  easeOut:(t:number)=>number;
  easeIn:(t:number)=>number;
  prev:d3.Selection<any>;

  constructor(private svg:d3.Selection<any>,
              private RADIUS:number) {
    this.color = d3.scale.category20c();
    this.pie = d3.layout.pie().value((d:any) => d.Data1).sort(null);
    this.arc = d3.svg.arc().outerRadius(RADIUS - 20).innerRadius(RADIUS - 60);

    this.svg.attr({
      width: this.RADIUS * 2,
      height: this.RADIUS * 2
    });

    this.g = this.svg.append('g').attr('transform', `translate(${this.RADIUS}, ${this.RADIUS})`);
    this.easeIn = d3.ease('quad-in');
    this.easeOut = d3.ease('quad-out');
  }

  update(data:Data[]) {
    let pieData = this.pie(data);
    let arc = this.arc;

    if (this.prev) {
      this.prev
        .transition()
        .duration(this.duration)
        .tween('exit arc', function () {
          let selection = d3.select(this);
          return (t:number) => {
            let r = 1 - t;
            let a = (Math.PI * 2) - (Math.PI * 2 * r);
            selection.attr('d', (d, i) => {
              let start = (d.startAngle * r) + a;
              let end = (d.endAngle * r) + a;
              return arc.startAngle(start).endAngle(end)(d, i);
            })
          }
        })
        .remove();
    }

    let path:d3.Selection<any> = this.g
      .selectAll('.path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('fill', d => this.color(d.data.Category))
      .call(d3tip({
        html: d => `<h5>${d.data.Category}</h5>${d.data.Data1}`
      }))

    path.transition()
      .duration(this.duration)
      .tween('entry arc', function () {
        let selection = d3.select(this);
        return (t:number) => {
          selection.attr('d', (d, i) => {
            let start = d.startAngle * t;
            let end = d.endAngle * t;
            return arc.startAngle(start).endAngle(end)(d, i);
          })
        }
      });

    this.prev = path;
  }
}