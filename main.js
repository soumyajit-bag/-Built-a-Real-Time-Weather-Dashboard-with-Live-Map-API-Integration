const map = L.map('map').setView([28.6139, 77.2090], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

L.marker([28.6139, 77.2090]).addTo(map);

const clockTime = document.getElementById('clock-time');
const clockDate = document.getElementById('clock-date');

function pad(value) {
    return value.toString().padStart(2, '0');
}

function updateClock() {
    const now = new Date();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    const date = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();

    clockTime.innerHTML = `${hours}:${minutes}:${seconds}`;
    clockDate.innerHTML = `${date} ${month} ${year}`;
}

updateClock();
setInterval(updateClock, 1000);

// ====================== WEATHER API ======================

const API_KEY = "c72a7e36926e0181389cb677140eac34";

// HTML Elements
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("weather-temp");
const humidity = document.getElementById("weather-humidity");
const windSpeed = document.getElementById("wind-speed");
const pressure = document.getElementById("pressure");
const weatherDesc = document.getElementById("weather-desc");
const cityInput = document.getElementById("city-input");

// Marker variable
let marker;

// Fetch Weather Function
function getWeather(city) {

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            console.log(data);

            // Update Weather Card
            cityName.innerHTML = data.name;
            temperature.innerHTML = Math.round(data.main.temp) + "°C";
            humidity.innerHTML = data.main.humidity + "%";
            windSpeed.innerHTML = data.wind.speed + " km/h";
            pressure.innerHTML = data.main.pressure + " hPa";
            weatherDesc.innerHTML = data.weather[0].main;

            // Update Map
            const lat = data.coord.lat;
            const lon = data.coord.lon;

            map.setView([lat, lon], 10);

            // Remove old marker
            if (marker) {
                map.removeLayer(marker);
            }

            // Add new marker
            marker = L.marker([lat, lon]).addTo(map);

        })
        .catch(error => {
            console.error("Weather Error:", error);
            alert("City not found!");
        });
}

// Default city when page loads
getWeather("Mumbai");

// Search on Enter
cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        const city = cityInput.value.trim();

        if (city !== "") {
            getWeather(city);
            getForecast(city);
        }

    }

});
function getCityTemp(city, elementId) {

    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    )
        .then(response => response.json())
        .then(data => {

            document.getElementById(elementId).innerHTML =
                Math.round(data.main.temp) + "°C";

        });
}

getCityTemp("Mumbai", "mumbai-temp");
getCityTemp("Delhi", "delhi-temp");
getCityTemp("Bangalore", "bangalore-temp");
getCityTemp("Kolkata", "kolkata-temp");

// 7 day forcaste//

function getForecast(city) {

    fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    )
        .then(response => response.json())
        .then(data => {

            const forecastIndices = [0, 8, 16, 24, 32];
            const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });

            forecastIndices.forEach((index, idx) => {
                const forecast = data.list[index];
                if (!forecast) return;

                const date = new Date(forecast.dt * 1000);
                const dayName = dayFormatter.format(date);

                const condition = forecast.weather[0].main;
                let icon = "☀️";
                if (condition === "Clouds") icon = "☁️";
                if (condition === "Rain") icon = "🌧️";
                if (condition === "Thunderstorm") icon = "🌩️";
                if (condition === "Snow") icon = "❄️";

                document.getElementById(`forecast-temp-${idx + 1}`).innerHTML =
                    Math.round(forecast.main.temp) + "°C";
                document.getElementById(`forecast-day-${idx + 1}`).textContent =
                    dayName;
                document.getElementById(`forecast-icon-${idx + 1}`).textContent =
                    icon;
            });

            // SVG GRAPH DATA
            for (let i = 0; i < 8; i++) {

                const forecast = data.list[i];
                if (!forecast) continue;

                const temp = Math.round(forecast.main.temp);
                const time = forecast.dt_txt.split(" ")[1].slice(0, 5);

                const condition = forecast.weather[0].main;
                let icon = "☀️";
                if (condition === "Clouds") icon = "☁️";
                if (condition === "Rain") icon = "🌧️";
                if (condition === "Thunderstorm") icon = "🌩️";
                if (condition === "Snow") icon = "❄️";

                document.getElementById(`temp${i + 1}`).textContent =
                    temp + "°";
                document.getElementById(`time${i + 1}`).textContent =
                    time;
                document.getElementById(`icon${i + 1}`).textContent =
                    icon;
            }

        });
}
getWeather("Mumbai");
getForecast("Mumbai");
