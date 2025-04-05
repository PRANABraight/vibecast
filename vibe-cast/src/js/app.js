import { fetchWeatherData, updateWeatherUI } from './weather.js';
import { getRecommendations, displayMusicRecommendations } from './music.js';
import { showLocationInfo } from './location-info.js';

document.addEventListener('DOMContentLoaded', () => {
    // Load default city weather
    fetchWeatherData('Bengaluru').then(weatherData => {
        if (weatherData) {
            updateWeatherUI(weatherData);
            displayWeatherData(weatherData);
        }
    });

    const weatherForm = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');

    weatherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        
        if (city) {
            try {
                const weatherData = await fetchWeatherData(city);
                if (weatherData) {
                    updateWeatherUI(weatherData);
                    displayWeatherData(weatherData);
                    const tracks = await getRecommendations(
                        weatherData.weather[0].main,
                        weatherData.main.temp
                    );
                    displayMusicRecommendations(tracks);
                    document.querySelector('.weather-section').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });

    // Add loading states
    const addLoadingState = () => {
        const button = weatherForm.querySelector('button');
        button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';
        button.disabled = true;
    };

    const removeLoadingState = () => {
        const button = weatherForm.querySelector('button');
        button.innerHTML = '<i class="fas fa-search"></i> Get Started';
        button.disabled = false;
    };
});

async function displayWeatherData(data) {
    // Add location info button functionality
    showLocationInfo(data.name, data.coord.lat, data.coord.lon);
}