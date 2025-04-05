function fetchWeatherData(city) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function fetchMusicRecommendations(weatherCondition) {
    const apiKey = process.env.SPOTIFY_API_KEY;
    const url = `https://api.spotify.com/v1/recommendations?seed_genres=${weatherCondition}&apikey=${apiKey}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Music recommendations not found');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error fetching music recommendations:', error);
    });
}

export { fetchWeatherData, fetchMusicRecommendations };