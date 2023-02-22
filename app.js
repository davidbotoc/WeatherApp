const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");
const currentWeatherItemsElement = document.getElementById("current-weather-items");
const timeZone = document.getElementById("time-zone");
const countryElement = document.getElementById("country");
const weatherForecastElement = document.getElementById("weather-forecast");
const currentTemperatureElement = document.getElementById("current-temp");

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const apiKey = 'AIzaSyBSAeovYooh8_fM6A6VVDyzNqndjmow8Dk'; // google apikey
const API_KEY = "72beca5fe6c3af85599e365245708d4e";//open weather map apikey

let city;
let country;

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const minutes = time.getMinutes();

    timeElement.innerHTML = (hour < 10 ? "0" + hour : hour) + ":" + (minutes < 10 ? "0"+minutes : minutes);
    dateElement.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);
        let _latitute = success.coords.latitude;
        let _longitude = success.coords.longitude;

        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${_latitute}&lon=${_longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                showWeatherData(data);
            })

        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${_latitute},${_longitude}&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                city = data.results[0].address_components.find(component => component.types.includes('locality')).long_name;
                country = data.results[0].address_components.find(component => component.types.includes('country')).long_name;
                getLocation(city, country);
            })
    });
}

function getLocation(city, country) {
    timeZone.innerHTML = country + "/" + city;
}

function showWeatherData (data) {
    let feels_like = data.current.feels_like;
    let humidity = data.current.humidity;
    let pressure = data.current.pressure;
    let wind_speed = data.current.wind_speed;
    let sunrise = data.current.sunrise;
    let sunset = data.current.sunset;

    countryElement.innerHTML = data.lat + "N " + data.lon + "E "

    currentWeatherItemsElement.innerHTML = 
    `<div class="weather-item">
        <div>It feels like</div>
        <div>${feels_like}&#176; C</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity} %</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure} hPa</div>
    </div>
    <div class="weather-item">
        <div>Wind speed</div>
        <div>${wind_speed} m/s</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format("HH:mm")}</div>
    </div>`;

    let otherDayForecast = "";
    data.daily.forEach((day, index) => {
        if(index == 0) {
            currentTemperatureElement.innerHTML = `<img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>`;
        } else {
            otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>`;
        }
    })

    weatherForecastElement.innerHTML = otherDayForecast;
}