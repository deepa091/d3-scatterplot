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
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
})
export class AreaChartComponent implements OnChanges {
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
    const chartContainer: any = document.getElementById('AreaChart');

    //Chart Margin
    this.margin = {
      top: 0,
      right: 60,
      bottom: 60,
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
    const htmlElem = document.getElementById('AreaChart');
    if (htmlElem != null)
      if (htmlElem.hasChildNodes()) {
        htmlElem.removeChild(htmlElem.children[0]);
      }

    this.svg = d3
      .select(this.elem)
      .select('.AreaChart')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + (this.margin.top + 40) + ')'
      );

    //Chart Function
    this.renderAreaChart();
  }
  renderAreaChart(): void {
    //---------------Variables--------------------
    let data: any = [];

    //sort the data by date
    this.chartData.sort((a: any, b: any) => {
      return a['Year'] - b['Year'];
    });

    let yearPop = 0;
    this.chartData.forEach((d: any, i: any) => {
      if (i != 0) {
        let lastObj = this.chartData[i - 1];
        if (d['Year'] == lastObj['Year']) {
          yearPop = yearPop + lastObj['Population_000s'];
        } else {
          yearPop = yearPop + lastObj['Population_000s'];
          data.push({
            Year: d3.timeParse('%Y')(lastObj['Year']),
            Value: yearPop,
          });
          yearPop = 0;
        }
      }
    });

    //---------Chart Code----------------------
    const myColor = d3.scaleOrdinal(d3.schemeCategory10);

    // Add X axis --> it is a date format
    const xDomain: any = d3.extent(data, (d: any) => {
      return d['Year'];
    });
    const x = d3.scaleTime().domain(xDomain).range([0, this.width]);

    const y = d3.scaleLinear().range([this.height, 0]);

    //Y Axis
    const minVal1: any = d3.min(data, (d: any) => {
      return d['Value'];
    });
    const maxVal1: any = d3.max(data, (d: any) => {
      return d['Value'];
    });

    y.domain([minVal1, maxVal1]);

    // Add the area
    this.svg
      .append('path')
      .datum(data)
      .attr('fill', '#cce5df')
      .attr('stroke', '#69b3a2')
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        d3
          .area()
          .x((d: any) => {
            return x(d['Year']);
          })
          .y0(y(0))
          .y1((d: any) => {
            return y(d['Value']);
          })
      );

    // Append Axes
    this.svg
      .append('g')
      .attr('class', 'myXaxis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x).ticks(3))
      .style('stroke-width', 0);
    this.svg
      .append('g')
      .attr('class', 'myYaxis')
      .call(d3.axisLeft(y).ticks(2))
      .style('stroke-width', 0);
  }
}
