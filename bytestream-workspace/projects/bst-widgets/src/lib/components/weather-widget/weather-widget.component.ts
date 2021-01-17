import { Component, Input, OnInit } from '@angular/core';
import WeatherData from '../../models/WeatherData';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.css']
})
export class WeatherWidgetComponent implements OnInit {

    weatherdata:WeatherData;
    @Input("weatherApiKey")apiKey:string;

    constructor(private weatherSvc:WeatherService) { }

    ngOnInit(): void {
        this.weatherSvc.getCurrentWeather(this.apiKey)
        .then(
            (data:WeatherData) =>{
                this.weatherdata = data
            } ,
            (err)=>console.log(err)
        )
    }
}
