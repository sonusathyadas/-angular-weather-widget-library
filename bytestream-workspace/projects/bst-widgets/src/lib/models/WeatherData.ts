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