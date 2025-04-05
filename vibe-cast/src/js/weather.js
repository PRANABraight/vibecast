// weather.js

const apiKey = '28028eb26a162a3876d89bfe01a6b28a'; // Hardcoded for testing

// Function to fetch weather data based on city input
export const fetchWeatherData = async (city) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('Weather data not found');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        alert('Error fetching weather data. Please try again.');
    }
};

// Function to update the UI based on weather conditions
export const updateWeatherUI = (weatherData) => {
    const weatherContainer = document.getElementById('weather-info');
    if (!weatherData || !weatherContainer) return;

    const temperature = Math.round(weatherData.main.temp);
    const weatherCondition = weatherData.weather[0].main;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const weatherIcon = getWeatherIcon(weatherCondition);

    weatherContainer.innerHTML = `
        <div class="weather-card">
            <div class="weather-header">
                <div class="location">
                    <i class="fas fa-map-marker-alt"></i>
                    <h2 class="city-name">${weatherData.name}</h2>
                </div>
                <div class="date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div class="weather-main">
                <div class="temperature-container">
                    <h3 class="temperature">${temperature}°C</h3>
                    <p class="condition">${weatherCondition}</p>
                </div>
                <div class="weather-icon">
                    ${weatherIcon}
                </div>
            </div>
            <div class="weather-details">
                <div class="detail-item">
                    <i class="fas fa-tint"></i>
                    <span>Humidity</span>
                    <p>${humidity}%</p>
                </div>
                <div class="detail-item">
                    <i class="fas fa-wind"></i>
                    <span>Wind Speed</span>
                    <p>${windSpeed} m/s</p>
                </div>
            </div>
        </div>
    `;

    // Update theme based on temperature and weather
    document.body.className = '';
    const theme = getWeatherTheme(weatherCondition, temperature);
    document.body.classList.add(theme.class);
    document.body.style.background = theme.gradient;
    
    // Add weather animation class
    weatherContainer.querySelector('.weather-card').classList.add(theme.animation);
};

function getWeatherIcon(condition) {
    const icons = {
        Clear: '<i class="fas fa-sun"></i>',
        Rain: '<i class="fas fa-cloud-rain"></i>',
        Clouds: '<i class="fas fa-cloud"></i>',
        Snow: '<i class="fas fa-snowflake"></i>',
        Drizzle: '<i class="fas fa-cloud-rain"></i>',
        Thunderstorm: '<i class="fas fa-bolt"></i>'
    };
    return icons[condition] || '<i class="fas fa-cloud"></i>';
}

function getWeatherTheme(condition, temperature) {
    const themes = {
        Clear: {
            hot: {
                class: 'theme-sunny-hot',
                gradient: 'linear-gradient(120deg, #ff6b6b 0%, #ffa07a 100%)',
                animation: 'weather-hot'
            },
            warm: {
                class: 'theme-sunny-warm',
                gradient: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
                animation: 'weather-warm'
            },
            cold: {
                class: 'theme-sunny-cold',
                gradient: 'linear-gradient(120deg, #a8edea 0%, #fed6e3 100%)',
                animation: 'weather-cold'
            }
        },
        Rain: {
            class: 'theme-rainy',
            gradient: 'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
            animation: 'weather-rain'
        },
        Clouds: {
            class: 'theme-cloudy',
            gradient: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
            animation: 'weather-cloudy'
        },
        Snow: {
            class: 'theme-snowy',
            gradient: 'linear-gradient(120deg, #e6e9f0 0%, #eef1f5 100%)',
            animation: 'weather-snow'
        },
        Thunderstorm: {
            class: 'theme-storm',
            gradient: 'linear-gradient(120deg, #4b6cb7 0%, #182848 100%)',
            animation: 'weather-storm'
        }
    };

    if (condition === 'Clear') {
        if (temperature >= 30) return themes.Clear.hot;
        if (temperature >= 20) return themes.Clear.warm;
        return themes.Clear.cold;
    }

    return themes[condition] || themes.Clear.warm;
}