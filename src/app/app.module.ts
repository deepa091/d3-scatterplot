import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatCardModule } from "@angular/material/card";
import { ScatterPlotModule } from './chartLibrary/scatter-plot/scatter-plot.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AreaChartModule } from './chartLibrary/area-chart/area-chart.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    ScatterPlotModule,
    AreaChartModule,
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
