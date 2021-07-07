const API_KEY = '494aa2805b40a50e5ac06cc1ccb34823';
const inputField = document.getElementById('city');
const searchBtn = document.getElementById('search-btn');
const outputContainer = document.querySelector('.output');
let brokenData;

const getWeatherByCity = () => {
    const city = inputField.value
    clearOutput()
    if (city !== '') {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}&units=metric`)
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => {
                if (!data.ok) {
                    brokenData = data;
                }
                console.log(data)
                console.log(JSON.stringify(data));

                const cityInfo = showBasicInfo(data);
                cityInfo.forEach(el => outputContainer.appendChild(el));

                const mainInfo = document.createElement('div');
                mainInfo.setAttribute('class', 'conditions-wrap');
                outputContainer.appendChild(mainInfo);

                const infoArray = createContainers(data);
                infoArray.forEach(el => mainInfo.appendChild(el));

            })
            .catch(error => {
                console.log(error);
                const errorDiv = errorMessage(brokenData.message);
                outputContainer.appendChild(errorDiv);
            })
    } else {
        const errorDiv = errorMessage('Please, input city!');
        outputContainer.appendChild(errorDiv);
    }
}

const clearOutput = () => {
    while (outputContainer.firstChild) {
        outputContainer.removeChild(outputContainer.firstChild);
    }
}

const createInfoContainer = (title, data) => {
    const divTitle = document.createElement('div');
    const divData = document.createElement('div');
    divTitle.textContent = title;
    divData.innerHTML = data;

    return [divTitle, divData];
}

const createContainers = (data) => {
    const [tempTitle, tempData] = createInfoContainer(
        'Temperature',
        `<span>${data.main.temp.toFixed(1)} °C</span>
                            (from ${data.main.temp_min.toFixed(1)} °C 
                            to ${data.main.temp_max.toFixed(1)} °C)`);

    const [feelsTitle, feelsData] = createInfoContainer(
        'Feels like',
        `<span>${data.main.feels_like.toFixed(1)} °C</span>`);

    const [pressureTitle, pressureData] = createInfoContainer(
        'Pressure',
        `<span>${data.main.pressure} hPa</span>`);

    const [humidityTitle, humidityData] = createInfoContainer(
        'Humidity',
        `<span>${data.main.humidity}%</span>`);

    const availableDirections = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    let windDirection = availableDirections[Math.floor((data.wind.deg / 22.5) + 0.5) % 16];

    const [windTitle, windData] = createInfoContainer(
        'Wind',
        `<span>${data.wind.speed}m/s</span> (${windDirection})`);

    const [cloudsTitle, cloudsData] = createInfoContainer(
        'Clouds',
        `<span>${data.clouds.all}%</span>`);

    return [
        tempTitle, tempData,
        feelsTitle, feelsData,
        pressureTitle, pressureData,
        humidityTitle, humidityData,
        windTitle, windData,
        cloudsTitle, cloudsData];
}

const showBasicInfo = (data) => {
    const countryCode = data.sys.country;
    const cityInfo = document.createElement('div');
    cityInfo.setAttribute('class', 'city-info');
    cityInfo.innerHTML = `
            <span>
                ${data.name}, ${countryCode}
                <img src="http://openweathermap.org/images/flags/${countryCode.toLowerCase()}.png" alt="${countryCode}">
            </span>
            ${data.weather[0].description}`;

    const timestamp = new Date(data.dt * 1000);
    const minutes = timestamp.getMinutes()
    let time;
    minutes > 9 ? time = `at ${timestamp.getHours()}:${timestamp.getMinutes()}` :
        time = `at ${timestamp.getHours()}:0${timestamp.getMinutes()}`;

    const observeTime = document.createElement('div');
    observeTime.setAttribute('class', 'observe-time');
    observeTime.textContent = time;

    return [cityInfo, observeTime];
}

const errorMessage = (message) => {
    const div = document.createElement('div');
    div.setAttribute('class', 'error');
    div.textContent = message;
    outputContainer.appendChild(div);
    return div
}

searchBtn.addEventListener('click', getWeatherByCity);