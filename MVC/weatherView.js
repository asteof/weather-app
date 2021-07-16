export default class WeatherView {

    constructor(handleGetWeather) {
        this.DOM = {
            inputField: document.getElementById('city'),
            searchBtn: document.getElementById('search-btn'),
            outputDiv: document.querySelector('.output'),
            conditionContainers: [...document.querySelectorAll('.condition')],
            cityInfo: document.querySelector('.city-info'),
            observeTime: document.querySelector('.observe-time'),
            errorDiv: document.querySelector('.error')
        };

        this.DOM.searchBtn.addEventListener('click', handleGetWeather);
        document.body.addEventListener('keypress',
            e => e.key === 'Enter' && handleGetWeather());
    }

    getCity = () => {
        return this.DOM.inputField.value;
    }

    renderInfo(data) {
        const countryCode = data.sys.country;
        this.DOM.cityInfo.innerHTML = `
            <span>
                ${ data.name }, ${ countryCode }
                <img 
                src="http://openweathermap.org/images/flags/${ countryCode.toLowerCase() }.png"
                 alt="${ countryCode } ">
            </span>
            ${ data.weather[0].description }`;

        const mainData = [
            `<span>${ data.main.temp } °C</span>
                            (from ${ data.main.temp_min } °C 
                            to ${ data.main.temp_max } °C)`,
            `<span>${ data.main.feels_like } °C</span>`,
            `<span>${ data.main.pressure } hPa</span>`,
            `<span>${ data.main.humidity }%</span>`,
            `<span>${ data.wind.speed }m/s</span> (${ data.windDirection })`,
            `<span>${ data.clouds.all }%</span>`
        ];

        this.DOM.conditionContainers.forEach((element, index) => {
            element.innerHTML = mainData[index];
        })

        this.DOM.observeTime.textContent = data.time;
    }

    showError() {
        this.DOM.errorDiv.textContent = 'Please, input city!';
        this.toggleError(true);
    }

    toggleError(isShow = false) {
        if (isShow) {
            this.DOM.outputDiv.style.display = 'none';
            this.DOM.errorDiv.style.display = 'block';
        } else {
            this.DOM.outputDiv.style.display = 'block';
            this.DOM.errorDiv.style.display = 'none';
        }
    }

    renderError(data) {
        this.DOM.errorDiv.textContent = data.message;
    }
}