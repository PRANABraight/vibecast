# VibeCast 🎵☀️

A dynamic web application that creates the perfect atmosphere by combining real-time weather data with mood-matched music recommendations.

## Features ✨

- **Real-time Weather Data**: Live weather updates using OpenWeather API
- **Music Recommendations**: Personalized song suggestions based on weather conditions via Spotify API
- **Dynamic UI**: Responsive interface that adapts to weather conditions
- **Location Details**: Detailed city information with interactive maps
- **Theme Switching**: Automatic light/dark theme based on system preferences
- **Responsive Design**: Seamlessly works across desktop and mobile devices

## Tech Stack 🛠️

- **Frontend**: HTML5, CSS3 (Sass), JavaScript (ES6+)
- **Frameworks**: Bootstrap 5
- **APIs**:
  - OpenWeather API for weather data
  - Spotify Web API for music recommendations
  - OpenStreetMap for location mapping
- **Build Tools**: Webpack, Sass

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- API keys for OpenWeather and Spotify

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vibecast.git
   cd vibecast
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your API keys.

4. Start development server:
   ```bash
   npm start
   ```

## Environment Variables 🔑

Required environment variables in your `.env` file:

```env
API_KEY=your_openweather_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

## Project Structure 📁

```
vibecast/
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   └── images/
│   ├── js/
│   │   ├── app.js
│   │   ├── weather.js
│   │   └── music.js
│   └── index.html
├── package.json
└── README.md
```

## Contributing 🤝

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- OpenWeather API for weather data
- Spotify Web API for music recommendations
- Bootstrap team for the framework
- Font Awesome for icons

## Screenshots 📸

### Landing Page
![Landing Page](vibe-cast/src/assets/images/landing.png)

### Music Recommendations
![Music Recommendations](vibe-cast/src/assets/images/recommendation.png)

## Contact 📧

Pranab Rai - [LinkedIn](https://linkedin.com/in/pranabrai)
Project Link: [https://github.com/yourusername/vibecast](https://github.com/pranabraight/vibecast)
