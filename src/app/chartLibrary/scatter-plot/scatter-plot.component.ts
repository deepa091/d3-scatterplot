import {
  Component,
  OnChanges,
  Input,
  ViewContainerRef,
  ViewChildren,
  Renderer2,
} from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.scss'],
})
export class ScatterPlotComponent implements OnChanges {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2
  ) {}

  @Input() chartData = [];

  elem: any;

  private margin: any;
  private svg: any;
  private width: any;
  private height: any;

  ngOnChanges(): void {
    this.getChartParams();
  }
  getChartParams(): void {
    const chartContainer: any = document.getElementById('Scatterplot');

    //Chart Margin
    this.margin = {
      top: 20,
      right: 200,
      bottom: 40,
      left: 60,
    };

    //Height & Width
    const containerWidth = chartContainer.offsetWidth,
      containerHeight = chartContainer.offsetHeight;

    this.width = containerWidth - this.margin.left - this.margin.right;
    this.height = containerHeight - this.margin.top - this.margin.bottom;

    //SVG Container
    this.elem = this.viewContainerRef.element.nativeElement;

    //Remove Child Elements
    const htmlElem = document.getElementById('Scatterplot');
    if (htmlElem != null)
      if (htmlElem.hasChildNodes()) {
        htmlElem.removeChild(htmlElem.children[0]);
      }

    this.svg = d3
      .select(this.elem)
      .select('.Scatterplot')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    //Chart Function
    this.renderScatterplot();
  }
  renderScatterplot(): void {
    //---------------Variables--------------------
    const data = this.chartData;

    //sort the data by date
    data.sort((a: any, b: any) => {
      return a['Year'] - b['Year'];
    });

    //---------Chart Code----------------------
    const myColor = d3.scaleOrdinal(d3.schemeCategory10);

    const x = d3.scaleLinear().range([0, this.width]),
      y = d3.scaleLinear().range([this.height, 0]);

    // create a tooltip
    const Tooltip = d3
      .select('body')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'none repeat scroll 0 0 #fff')
      .style('border', '1px solid silver')
      .style('padding', '10px')
      .style('text-align', 'justify')
      .style('cursor', 'pointer');

    // Scale the range of the data
    //X Axis
    const minVal: any = d3.min(data, (d) => {
      return d['Population_Density'];
    });
    const maxVal: any = d3.max(data, (d) => {
      return d['Population_Density'];
    });

    x.domain([minVal, maxVal]);
    //Y Axis
    const minVal1: any = d3.min(data, (d) => {
      return d['Population_Growth_Rate'];
    });
    const maxVal1: any = d3.max(data, (d) => {
      return d['Population_Growth_Rate'];
    });

    y.domain([minVal1, maxVal1]);

    //Append Axes
    this.svg
      .append('g')
      .attr('class', 'myXaxis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .attr('opacity', '0');
    this.svg.append('g').call(d3.axisLeft(y));

    //Axis Transition
    this.svg
      .select('.myXaxis')
      .transition()
      .duration(2000)
      .attr('opacity', '1')
      .call(d3.axisBottom(x));

    //Axes Titles
    this.svg
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height + 35)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text('Population Density');

    this.svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -this.margin.left)
      .attr('x', 0 - this.height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text('Population Growth Rate');

    // Add dots
    this.svg
      .append('g')
      .selectAll('dot')
      .attr('class', 'scatterCircle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => {
        return x(d['Population_Density']);
      })
      .attr('cy', (d: any) => {
        return y(d['Population_Growth_Rate']);
      })
      //Size of the scatters based on population
      .attr('r', (d: any) => {
        return 2;
      })
      //Color of Scatters based on Region
      .style('fill', (d: any, i: any) => {
        return myColor(d['Region']);
      })
      .style('fill-opacity', 0.65)
      .style('stroke', '#cdc9c9')
      .style('stroke-width', 1)
      //------Tooltip----
      //Mouseover
      .on('mouseover', (d: any) => {
        Tooltip.style('opacity', 1);
      })
      //Mouse Move
      .on('mousemove', (d: any, i: any) => {
        Tooltip.html(
          'Year: ' +
            i.Year +
            '<br/> Region:' +
            i['Region'] +
            '<br/> Country:' +
            i['Country'] +
            '<br/> Population:' +
            i['Population_000s'] +
            '<br/> Population Density:' +
            i['Population_Density'] +
            '<br/> Population Growth Rate:' +
            i['Population_Growth_Rate']
        )
          .style('left', d.pageX + 20 + 'px')
          .style('top', d.pageY + 'px');
      })
      //Mouse leave
      .on('mouseleave', (d: any) => {
        Tooltip.style('opacity', 0);
      })
      //Circle Transition
      .transition()
      .delay((d: any, i: any) => {
        return i * 3;
      })
      .duration(1000)
      .attr('cx', (d: any) => {
        return x(d['Population_Density']);
      })
      .attr('cy', (d: any) => {
        return y(d['Population_Growth_Rate']);
      })
      .attr('r', (d: any) => {
        return d['Population_000s'] / 50;
      });

    //-----------Legend-Region-----------------
    const legendData = [...new Set(data.map((item: any) => item.Region))];

    //Shape
    this.svg
      .selectAll('mylabels')
      .data(legendData)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('cx', this.width + 40)
      .attr('cy', (d: any, i: any) => {
        return 50 + i * 25;
      }) // 50 is where the first dot appears. 25 is the distance between dots
      .style('fill', (d: any) => {
        return myColor(d);
      })
      .style('stroke', '#cdc9c9')
      .style('stroke-width', 1);
    //Text
    this.svg
      .selectAll('mylabels')
      .data(legendData)
      .enter()
      .append('text')
      .attr('x', this.width + 50)
      .attr('y', (d: any, i: any) => {
        return 52 + i * 25;
      }) // 52 is where the first dot appears. 25 is the distance between dots
      .style('fill', (d: any) => {
        return myColor(d);
      })
      .text((d: any) => {
        return d;
      })
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle');
  }
}
