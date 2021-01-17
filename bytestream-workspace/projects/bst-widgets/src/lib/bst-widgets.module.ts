import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { WeatherWidgetComponent } from './components/weather-widget/weather-widget.component';

@NgModule({
    declarations: [WeatherWidgetComponent],
    imports: [
        HttpClientModule,
        CommonModule
    ],
    exports: [WeatherWidgetComponent]
})
export class BstWidgetsModule { }
