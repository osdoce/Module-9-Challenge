import dotenv from 'dotenv';
dotenv.config();

//TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather{
  city: string; 
  date: string;
  icon: string; 
  iconDescription: string; 
  tempF: string;
  windSpeed: string;
  humidity: string;

  constructor(city: string = "Chicago", date: string = "2025-01-09 06:00:00", icon: string = "13n", iconDescription: string = "broken clouds", tempF: string = "0.68", windSpeed: string = "4.6", humidity: string = "88") {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string = `https://api.openweathermap.org/data/2.5/weather?q=`;
  apiKey: string = 'c0dd0c20dccdd0b266dbb29b1b231f0b';
  cityName: string = '';

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const queryUrl = this.baseURL + query + `&appid=` + this.apiKey + '&units=imperial';
    console.log(queryUrl);
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/JSON',
      },
    });
    const json = await response.json();
    return json;
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    let { lat, lon } = locationData;
    let latString: string = lat.toString();
    let lonString: string = lon.toString();
    
    let indexlat = latString.indexOf(".") + 3;
    let indexlon = lonString.indexOf(".") + 3;
    const newlatString = latString.slice(0, indexlat);
    const newlonString = lonString.slice(0, indexlon);

    let newlat = Number(newlatString);
    let newlon = Number(newlonString);
    const resultado: Coordinates = { lat: newlat, lon: newlon };
    return resultado;
  }
  
  
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const baseGeoURL: string = `https://api.openweathermap.org/data/2.5/forecast?`;
    return baseGeoURL;
    }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return this.buildGeocodeQuery() + 'lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + this.apiKey;  
  }
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const queryUrl = this.buildWeatherQuery(coordinates);
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/JSON',
      },
    });
    const json = await response.json();
    return json;
    ;
  }
  
  // TODO: Build parseCurrentWeather method
  /**
  private parseCurrentWeather(response: any) {

    console.log(`------`);
    console.log(response.list[0]);
    console.log(`------`);
    console.log(response.list[0].dt_txt);

  }
  
   */

  // TODO: Complete buildForecastArray method
 
  private buildForecastArray(respuesta: any): Weather {
    const x = new Weather();
    const fechaCorta = respuesta.dt_txt.toString().slice(0, 10);
    x.date = fechaCorta;
    x.icon = respuesta.weather[0].icon;
    x.iconDescription = respuesta.weather[0].description;
    x.tempF = respuesta.main.temp;
    x.windSpeed = respuesta.wind.speed;
    x.humidity = respuesta.main.humidity;

    return x;
 }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    console.log('Entrando a getWeatherCity: ' + city);    
    const respuesta = await this.fetchLocationData(city);

    
    const coordinaditas: Coordinates = this.destructureLocationData(respuesta.coord);
    console.log(`coordinaditas: ` + JSON.stringify(coordinaditas));
    
    const respuestaDias = await this.fetchWeatherData(coordinaditas);

    const fecha = new Date(respuesta.dt * 1000);
    const x = new Weather();
    x.city = city;
    x.date = fecha.toLocaleDateString('en-CA');
    x.icon = respuesta.weather[0].icon;
    x.iconDescription = respuesta.weather[0].description;
    x.tempF = respuesta.main.temp;
    x.windSpeed = respuesta.wind.speed;
    x.humidity = respuesta.main.humidity;
    
    const respuestaArray = [];
    respuestaArray[0] = x;
    respuestaArray[1] = this.buildForecastArray(respuestaDias.list[7]);
    respuestaArray[2] = this.buildForecastArray(respuestaDias.list[15]);
    respuestaArray[3] = this.buildForecastArray(respuestaDias.list[23]);
    respuestaArray[4] = this.buildForecastArray(respuestaDias.list[31]);
    respuestaArray[5] = this.buildForecastArray(respuestaDias.list[39]);
    return respuestaArray;
  }
}

export default new WeatherService();
