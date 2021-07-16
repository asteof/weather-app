import WeatherView from "./weatherView.js";
import WeatherModel from "./weatherModel.js";

class WeatherController {
    constructor() {
        this.model = new WeatherModel(this.handleLoadOK, this.handleLoadError);
        this.view = new WeatherView(this.handleGetWeather);
    }

    handleGetWeather = () => {
        const city = this.view.getCity();

        if (city === '') {
            this.view.showError();
            return;
        }
        this.model.getWeather(city);
    }

    handleLoadOK = (data) => {
        this.view.toggleError();
        this.view.renderInfo(data);
    }

    handleLoadError = (data) => {
        console.log('error', data);
        this.view.toggleError(true);
        this.view.renderError(data);
    }
}


const weatherApp = new WeatherController();
console.log(weatherApp)