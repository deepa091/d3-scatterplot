import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ABC CO.';

  selectedYear = '2021';

  constructor() {}

  chartData: any = [];
  yearlyData: any = [];
  filterData: any = [];

  //KPI
  total_pop: any = 0;
  pop_growth: any = 0;
  pop_density: any = 0;

  //Chart Data
  scatterChartData: any = [];
  areaChartData: any = [];

  ngOnInit() {
    //Import Data from CSV file
    d3.csv('../assets/data/population.csv')
      .then((data) => {
        // Use data
        this.chartData = data.map((d: any) => {
          return {
            Country: d.Country,
            Year: parseInt(d.Year),
            Population_000s: parseInt(d.Population_000s),
            Population_Density: parseInt(d.Population_Density),
            Population_Growth_Rate: parseFloat(d.Population_Growth_Rate),
            Region: d.Region,
          };
        });
        //Year Filter Data
        this.yearlyData = [
          ...new Set(this.chartData.map((item: any) => item.Year)),
        ];

        //Area Chart Data
        // this.areaChartData = this.chartData.reduce((acc: any, obj: any) => {
        //   return acc + obj['Population_000s'];
        // }, 0);
        // this.areaChartData = this.chartData.from(arr.reduce(
        //   (m, {name, value}) => m.set(name, (m.get(name) || 0) + value), new Map
        // ), (['Year','Population_000s']) => ({name, value}));

        //sort the data by date
        this.chartData.sort((a: any, b: any) => {
          return a['Year'] - b['Year'];
        });
        
        // console.log(this.areaChartData);

        //All Data
        this.selectedYear = '2021';
        this.selected(this.selectedYear);
      })
      .catch((err) => {
        // Handle err
        console.log('Error:', err);
      });
  }

  selected(value: any) {
    this.selectedYear = value;

    //Data for Chart
    // //All
    // if (this.selectedYear == 'All') {
    //   this.filterData = this.chartData;
    // } //Selected Year
    // else {
    //   this.filterData = this.chartData.filter((d: any) => {
    //     return d.Year == this.selectedYear;
    //   });
    // }
    this.filterData = this.chartData.filter((d: any) => {
      return d.Year == this.selectedYear;
    });

    //KPI Cards
    this.kpiCards();
  }

  kpiCards() {
    const tempData = this.filterData.filter((item: any) => {
      return !isNaN(item.Population_Growth_Rate);
    });
    //Total Population
    this.total_pop = this.filterData
      .map((item: any) => item.Population_000s)
      .reduce((prev: any, next: any) => prev + next);

    //Total Population Density
    const density = this.filterData
      .map((item: any) => item.Population_Density)
      .reduce((prev: any, next: any) => prev + next);

    this.pop_density = (density / this.filterData.length).toFixed(2);
    //Total Population Growth
    const growth = tempData
      .map((item: any) => item.Population_Growth_Rate)
      .reduce((prev: any, next: any) => prev + next);
    this.pop_growth = (growth / this.filterData.length).toFixed(2);
  }
}
