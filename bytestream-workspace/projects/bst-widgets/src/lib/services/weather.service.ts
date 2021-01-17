import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import WeatherData from '../models/WeatherData';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {

    private lattitude: number;
    private longitude: number;

    constructor(private http: HttpClient) { }

    getLatLong(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.lattitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    resolve(position);
                }, (err) => {
                    console.log("Error in fetching coords," + err.message);
                    reject(err);
                });
            } else {
                console.log("Geolocation not supported");
                reject("Geolocation not supported");
            }
        })

    }

    async getCurrentWeather(apiKey: string) {
        let position = await this.getLatLong();
        let url: string = `https://api.openweathermap.org/data/2.5/weather?lat=${this.lattitude}&lon=${this.longitude}&units=metric&appid=${apiKey}`
        return this.http.get<WeatherData>(url).toPromise();
    }
}
