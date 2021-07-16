export default class WeatherModel {
    API_KEY = '494aa2805b40a50e5ac06cc1ccb34823';
    brokenData;
    availableDirections =
        ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

    constructor(handleLoadOK, handleLoadError) {
        this.handleLoadOK = handleLoadOK;
        this.handleLoadError = handleLoadError;
    }

    getWeather = (city) => {
        if (city !== '') {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${ city }&APPID=${ this.API_KEY }&units=metric`
            fetch(url)
                .then(response => response.json())
                .then(data => {
                        data.cod === 200 ? this.formatOKData(data) : this.handleLoadError(data);
                        // brokenData = data;
                        console.log(data)
                        console.log(JSON.stringify(data));
                    }
                )
        }
    }

    formatOKData(data) {
        this.formatData(data);
        this.handleLoadOK(data);
    }

    formatData(data) {
        data.main.temp = data.main.temp.toFixed(1);
        data.main.temp_min = data.main.temp_min.toFixed(1);
        data.main.temp_max = data.main.temp_max.toFixed(1);
        data.main.feels_like = data.main.feels_like.toFixed(1);

        data.windDirection = this.availableDirections[Math.floor((data.wind.deg / 22.5) + 0.5) % 16];


        const timestamp = new Date(data.dt * 1000);
        const minutes = timestamp.getMinutes();
        const hours = timestamp.getHours();
        data.observeTime = `at ${ this.addLeadingZero(hours) }:${ this.addLeadingZero(minutes) }`;
    }

    addLeadingZero = time => time > 9 ? time : `0${ time }`;
}