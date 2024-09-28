const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "daf09c18a022863eaefe8f6eacd3caf1"; // 
const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { // HTML for the other five-day forecast card
        return `<li class="card">
                    <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
};

const fetchWeatherData = async (cityName) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`);
        const data = await response.json();
        if (data.cod !== "200") {
            throw new Error(data.message);
        }

        const weatherItems = data.list.slice(0, 6); // Take first 6 items for current and 5-day forecast

        // Clear previous data
        currentWeatherDiv.innerHTML = createWeatherCard(cityName, weatherItems[0], 0);
        weatherCardsDiv.innerHTML = weatherItems.slice(1).map((item, index) => createWeatherCard(cityName, item, index + 1)).join('');
    } catch (error) {
        alert("Error fetching weather data: " + error.message);
    }
};

const fetchWeatherByLocation = async (lat, lon) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();
        if (data.cod !== "200") {
            throw new Error(data.message);
        }

        const weatherItems = data.list.slice(0, 6); // Take first 6 items for current and 5-day forecast

        // Clear previous data
        currentWeatherDiv.innerHTML = createWeatherCard(data.city.name, weatherItems[0], 0);
        weatherCardsDiv.innerHTML = weatherItems.slice(1).map((item, index) => createWeatherCard(data.city.name, item, index + 1)).join('');
    } catch (error) {
        alert("Error fetching weather data: " + error.message);
    }
};

searchButton.addEventListener("click", () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        fetchWeatherData(cityName);
    } else {
        alert("Please enter a city name.");
    }
});

locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherByLocation(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                alert("Error retrieving location: " + error.message);
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
