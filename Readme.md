# Working with Angular libraries
Angular is one of the most commonly used framework for developing Single Paged Applications. All of you or some of you must be familiar with Angular framework for developing SPA application. An SPA application contains components for UI elements, Pipes for transforming data, Directives for adding or changing behaviour and appearence, and services for reusable injectable services. Consider that your company is developing multiple web applications using Angular and some of the features and functionalities are common in all applications. For example all of these Angular applications are using a common login functionality, a common UI theme provided by directives etc. But it will be difficult for you to create these common features in each and every application you develop. You may need to re-write the code multiple times in various applications. It may affect the consistency and maintainability of these features. Angular provides a feature called *Libraries* which helps you to create reusable packages using Angular framework which you can integrate with all of your applications. 

An *Angular library* is a project which you can create using Angular CLI. It is different from the traditional web app you create in Angular. It cannot run on its own and you need to import it with your web application to use it. We will be using some of the features and functionalities in multiple applications such as service workers, Angular material , forms support etc. As a developer you can develop these functionalities as libraries and publish into npm so that you will be able to use it anywhere. You may use these angular libraries in Angular applications only. To use Angular libraries in a non-Angular application you need to use *Angular custom elements*.

## Creating a simple Angular library
Try out the following steps to create an Angular library project and use it with you Angular web application.

1) Open the command prompt and check the angular cli installation

    `ng --version`

2) If Angular CLI is not installed in your machine, you can install it using the following command.

    `npm install -g @angular/cli`

3) Create an Angular project workspace without creating a web application.

    `ng new bytestream-workspace --create-application=false`

4) Move to the project folder.

    `cd bytestream-workspace`

5) Generate a library project within the workspace you have created.

    `ng generate library bst-widgets`

    The above command will create library project files in the *projects/bst-widgets* folder. Libraries have their own *package.json* configuration files. The following files will be created as part of the project.
    
    |Source files/dirs  | Description  |
    |-------------------| -------------|
    |src/lib            | Contains your library project's logic and data. Like an application project, a library project can contain components, services, modules, directives, and pipes.|
    |src/test.ts        | The main entry point for your unit tests, with some library-specific configuration. You don't typically need to edit this file. |
    |src/public-api.ts  | Specifies all files that are exported from your library. |
    |karma.conf.js      | Library-specific Karma configuration. |
    |ng-package.json    | Configuration file used by *ng-packagr* for building your library. |
    |package.json       | Configures npm package dependencies that are required for this library. |
    |tsconfig.lib.json  | Library-specific TypeScript configuration, including TypeScript and Angular template compiler options. |
    |tsconfig.spec.json | TypeScript configuration for the library tests. |
    |tslint.json        | Library-specific TSLint configuration. |

6) Inside the *src/lib* folder you will be able to see a set of ts files. The default template will contain a srevice file, a component and a Module. You can update these files or add more resources or delete and create new files to it.

7) To make your library reusable, you need to define a public API for it. This helps the consumers of your API to access the public functionalities such as modules, services through a single import path. The public API for your library is maintained in the *public-api.ts* file in your library folder. Anything exported from this file is made public when your library is imported into an application. 

8) Delete all files from the *src/lib* folder except the module file. You can now open the module file and import `HttpClientModule` and `CommonModule` it to the module. 

9) Create `models` folder inside the `lib` folder and add a new file `WeatherData.ts` inside it. Add the following code to it.
    ```typescript
    export default interface WeatherData {
        coord: Coordinates;
        weather: WeatherInfo[];
        base: string;
        main: TemperatureInfo;
        visibility: number;
        wind: WindInfo;
        clouds: CloudsInfo;
        dt: number;
        sys: SysInfo;
        timezone: number;
        id: number;
        name: string;
        cod: number;
    }
    export interface Coordinates {
        lat: number;
        lon: number;
    }
    
    export interface WeatherInfo {
        id: number;
        main: string;
        description: string;
        icon: string;
    }
    export interface TemperatureInfo {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    }
    export interface WindInfo {
        speed: number;
        deg: number;
    }
    
    export interface CloudsInfo {
        all: number;
    }
    
    export interface SysInfo {
        type: number;
        id: number;
        country: string,
        sunrise: number;
        sunset: number;
    }
    ```

10) Add a new service called `WeatherService` with the following command.
    
    `ng generate service services/weather --project bst-widgets`

11) Add the following code to the *WeatherService* file
    ```typescript
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
    ```

12) Create a new component file called *weather-widget.component* using the following command.
    
    `ng g c components/weather-widget --project bst-widgets`

13) Update the *weather-widget.component.ts* file with the following code.
    
    ```typescript
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
    ```

14) Open the *weather-widget.component.css* and add the following code.
    ```css    
    .weather-table{
        background-color: cornflowerblue;
        border-radius: 10px;
        height: 150px;
        width: 350px;
        margin: 0 auto;
        border-collapse: collapse;
        border-color:white;
        text-align: left;
        color:white;
    }
    
    .weather-table #mainrow{
        border-bottom: 1px solid white;
    }
    
    .weather-table #col1{
        border-right: 1px solid white;
        width: 45%;
        padding-left: 10px;
        font-size: 15px;
        font-weight: lighter;
        color:honeydew
    }
    
    .weather-table #col2{
        border-left: 1px solid white;
        width: 55%;
        padding-left: 10px;
        font-size: 14px;
        font-weight: lighter;
        color:honeydew
    }
    
    .location-style{
        color:white;
        font-size: 22px;
        padding-left:10px
    }
    .weather-style{
        color:cornsilk;
        padding-left: 10px;
        font-size: 20px;
    }
    
    .weather-desc{
        color:whitesmoke;
        font-size: 16px;
        font-weight: lighter;
        padding-left: 10px;
    }
    .wind-title{
        font-size: 16px;
        font-weight: bold;
    }
    ``` 
15) Open the *weather-widget.component.html` and add the following code to it.
    
    ```html
        <div *ngIf="weatherdata" style="text-align: center;">
        <table class="weather-table">
            <tr id="mainrow">
                <th colspan="2">
                    <span class="location-style">{{weatherdata.name}} ({{weatherdata.sys.country}})</span> &nbsp; -
                    <span class="weather-style">{{weatherdata.weather[0].main}}</span>
                    <br />
                    <span class="weather-desc">{{weatherdata.weather[0].description}}</span>
                </th>
            </tr>
            <tr id="subrow">
                <th id="col1">
                    <span>Temp : {{weatherdata.main.temp}}&#8451;</span><br />
                    <span>Feels like: {{weatherdata.main.feels_like}}&#8451;</span><br />
                    <span>Humidity : {{weatherdata.main.humidity}}%</span>
                </th>
                <th id="col2">
                    <span class="wind-title">Wind </span><br />
                    <span> speed : {{ (weatherdata.wind.speed * 60 *60)/1000}} Km/hr</span><br />
                    <span> Degree: {{weatherdata.wind.deg}}</span>
                </th>
            </tr>
        </table>
    </div>
    ```

16) Open the module file and confirm whether the component is registered under the `declarations` section and export the same component using the `exports` section.

    ```typescript
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
    ```
17) You can now check for the compilation errors. Open the *package.json* file from the workspace folder. Add a new script to build the library project. 

    ```json
    {
        "name": "bytestream-workspace",
        "version": "0.0.0",
        "scripts": {
            "ng": "ng",
            "start": "ng serve",
            "build": "ng build",
            "test": "ng test",
            "lint": "ng lint",
            "widgetbuild": "ng build bst-widgets",
            "e2e": "ng e2e"
            },
        .....
    }
    ```
    
    Run the build command to compile and build the project.

    `npm run widgetbuild`
    
    This will create a *dist* folder with all the compiled files. The builder of the project is configured in a different way compared to the other application. The default builder ensures the library is always build with the *AOT compiler*. You dont need to specify the **--prod** flag while building the project. It is configured by default.

## Create a library consumer application

1) You can now add a new web application to the same project workspace. This application will consume the library you have created above. Run the followin command from the project workspace folder.

    `ng generate application bst-web-spa`

2) This will create a new application project in the same *projects* folder. Now your *angular.json* file will be updated with some configuration changes. You will see an new project configuration is added under the `projects` attribute of the *angular.json* file.  
    ```json
    {
        "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
        "version": 1,
        "newProjectRoot": "projects",
        "projects": {
            "bst-widgets": {
                "projectType": "library",
                "root": "projects/bst-widgets",
                "sourceRoot": "projects/bst-widgets/src",
                "prefix": "lib",
                "architect": {
                .....
                }
            },
            "bst-web-spa": {
                "projectType": "application",
                "schematics": {},
                "root": "projects/bst-web-spa",
                "sourceRoot": "projects/bst-web-spa/src",
                "prefix": "app",
                "architect": {
                ..........
                }
            }
        }
    }    
    ```
3) Open the *app.module.ts* file and import the *BstWidgetModule* to it.

    ```typescript
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { BstWidgetsModule } from 'bst-widgets';
    
    import { AppComponent } from './app.component';
    
    @NgModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        BstWidgetsModule
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
    ```

4) Open the *app.component.html* file and remove all html code from it. Add the *weather widget* to the *app.component.html* by calling the selector of the weather widget component.

    ```html
    <h2>Sample Web Application</h2>
    <weather-widget weatherApiKey="YOUR_WEATHER_API_KEY" ></weather-widget>
    ``` 
    > [!IMPORTANT]
    > You need to replace the *YOUR_WEATHER_API_KEY* with the API key that you have obtained from the [https://openweathermap.org/api](https://openweathermap.org/api) web site. You can create a free account and subscribe for a free weather API. 
5) Open the *package.json* file from the project workspace folder and add a script command to run and build the web application.
    ```json
    {
        "name": "bytestream-workspace",
        "version": "0.0.0",
        "scripts": {
            "ng": "ng",
            "start": "ng serve",
            "build": "ng build",
            "test": "ng test",
            "lint": "ng lint",
            "widgetbuild": "ng build bst-widgets",
            "spabuild":"ng build bst-web-spa",
            "spa":"ng serve bst-web-spa",
            "e2e": "ng e2e"
        },
    ....
    ```

6) Run the application by executing the script command.

    `npm run spa`

7) Once the application is compiled and run successfully, navigate to the application url (http://localhost:4200)

## Publishing the libraries
You have successfully created and tested the weather-widget library. Now, you need to publish the library package which you can use in your other projects. To package and distribute the library as a package you have multiple approaches.
    * Publish and package as TAR archive
    * Publish the package to NPM repository.

### Publish the package as TAR archive 
1) Open the terminal in the project workspace folder and run the following command to build library project.

    `ng build bst-widgets`
    
    OR

    `npm run widgetbuild`

2) Now, you can pack the build output to TAR archive

    `cd dist/bst-widgets`

    `npm pack`

3) A tar package file will be created inside the */dist/bst-widgets* folder (eg: bst-widgets-0.0.1.tgz).

4) Open the *tsconfig.json* file in the project workspace. Remove the `paths` section.

    ```json
    "paths": {
      "bst-widgets": [
        "dist/bst-widgets/bst-widgets",
        "dist/bst-widgets"
      ]
    }
    ```
5) Install the widgets package to the web project using npm command. For set the terminal path to the project workspace folder and run the following command.

    `npm install ./dist/bst-widgets/bst-widgets-0.0.1.tgz`

6) In the *package.json* file of the project workspace folder, you will see the package is installed under the dependencies section.

    ```json
    ...
    "dependencies": {
        "@angular/animations": "~11.0.5",
        "@angular/common": "~11.0.5",
        "@angular/compiler": "~11.0.5",
        "@angular/core": "~11.0.5",
        "@angular/forms": "~11.0.5",
        "@angular/platform-browser": "~11.0.5",
        "@angular/platform-browser-dynamic": "~11.0.5",
        "@angular/router": "~11.0.5",
        "bst-widgets": "file:dist/bst-widgets/bst-widgets-0.0.1.tgz",
        "rxjs": "~6.6.0",
        "tslib": "^2.0.0",
        "zone.js": "~0.10.2"
      },
    ...
    ```
7) Build the web application using the following command.

    `ng build bst-web-spa`

    OR

    `npm run spabuild`

8) This will compile and generate the build output in the *dist/bst-web-spa* folder. You can now run the application using the *http-server*. If the *http-server* is not installed in your system, you can install it using `npm i -g http-server`. 

    `http-server ./dist/bst-web-spa`

9) The application will run on port number 8081. Open browser and navigate to 'http://localhost:8081`. After few seconds you will see the weather widget will display the current location weather data.

### Publish the package to NPM repository
1) 




