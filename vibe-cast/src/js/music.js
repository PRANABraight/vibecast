import { getSpotifyToken } from './spotify-auth.js';

const weatherToMoodMap = {
    Clear: { genres: 'pop', valence: 0.7, energy: 0.8 },
    Rain: { genres: 'classical', valence: 0.3, energy: 0.4 },
    Clouds: { genres: 'indie', valence: 0.5, energy: 0.5 },
    Snow: { genres: 'acoustic', valence: 0.4, energy: 0.3 },
    Thunderstorm: { genres: 'rock', valence: 0.6, energy: 0.8 }
};

const fallbackSongs = {
    Clear: [
        { name: "Happy", artist: "Pharrell Williams", url: "https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH" },
        { name: "Walking on Sunshine", artist: "Katrina & The Waves", url: "https://open.spotify.com/track/05wIrZSwuaVWhcv5FfqeH0" }
    ],
    Rain: [
        { name: "Set Fire to the Rain", artist: "Adele", url: "https://open.spotify.com/track/73CMRj62VK4bLmKh6Sv1KH" },
        { name: "Purple Rain", artist: "Prince", url: "https://open.spotify.com/track/54X78diSLoUDI3joC2bjMz" }
    ]
};

export async function getRecommendations(weatherCondition, temperature) {
    try {
        const token = await getSpotifyToken();
        const mood = weatherToMoodMap[weatherCondition] || weatherToMoodMap.Clear;

        const params = new URLSearchParams({
            seed_genres: mood.genres,
            target_valence: mood.valence.toString(),
            target_energy: mood.energy.toString(),
            limit: '6',
            market: 'US',
            min_popularity: '50'
        });

        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        // Try the request up to 3 times
        for (let attempt = 0; attempt < 3; attempt++) {
            const response = await fetch('https://api.spotify.com/v1/recommendations?' + params.toString(), options);
            
            if (response.ok) {
                const data = await response.json();
                if (data.tracks?.length > 0) {
                    return data.tracks;
                }
            }
            
            // If we get a 401, try to get a new token
            if (response.status === 401) {
                const newToken = await getSpotifyToken();
                options.headers.Authorization = `Bearer ${newToken}`;
                continue;
            }
            
            // Log the error details
            const errorText = await response.text();
            console.error('Attempt', attempt + 1, 'failed:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        throw new Error('Failed to get recommendations after 3 attempts');
    } catch (error) {
        console.error('Detailed error:', error);
        return fallbackSongs[weatherCondition] || fallbackSongs.Clear;
    }
}

export function displayMusicRecommendations(tracks) {
    const container = document.getElementById('music-recommendations');
    if (!tracks || !container) {
        console.error('No tracks or container found');
        return;
    }

    const defaultAlbumArt = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU1RTUiLz48cGF0aCBkPSJNMTUwIDEyNUMxNjAgMTI1IDE3MCAxMzUgMTcwIDE0NUMxNzAgMTU1IDE2MCAxNjUgMTUwIDE2NUMxNDAgMTY1IDEzMCAxNTUgMTMwIDE0NUMxMzAgMTM1IDE0MCAxMjUgMTUwIDEyNVoiIGZpbGw9IiM5OTkiLz48cGF0aCBkPSJNMTUwIDg1QzE4NSA4NSAyMTUgMTE1IDIxNSAxNTBDMjE1IDE4NSAxODUgMjE1IDE1MCAyMTVDMTE1IDIxNSA4NSAxODUgODUgMTUwQzg1IDExNSAxMTUgODUgMTUwIDg1Wk0xNTAgNzVDMTEwIDc1IDc1IDExMCA3NSAxNTBDNzUgMTkwIDExMCAyMjUgMTUwIDIyNUMxOTAgMjI1IDIyNSAxOTAgMjI1IDE1MEMyMjUgMTEwIDE5MCA3NSAxNTAgNzVaIiBmaWxsPSIjOTk5Ii8+PC9zdmc+';

    container.innerHTML = `
        <div class="col-12">
            <h2 class="text-center mb-4">Weather-Based Music Recommendations</h2>
            <div class="row g-4 justify-content-center">
                ${tracks.map(track => {
                    const imageUrl = track.album?.images?.[1]?.url || 
                                   track.album?.images?.[0]?.url || 
                                   defaultAlbumArt;

                    return `
                        <div class="col-md-4 col-lg-3">
                            <div class="music-card">
                                <div class="album-art-container">
                                    <img 
                                        src="${imageUrl}"
                                        alt="${track.name}"
                                        class="img-fluid rounded mb-3 album-art"
                                        onerror="this.onerror=null; this.src='${defaultAlbumArt}'"
                                    />
                                </div>
                                <h4 class="song-title text-truncate">${track.name}</h4>
                                <p class="artist-name text-truncate">
                                    ${track.artists ? track.artists.map(artist => artist.name).join(', ') : track.artist}
                                </p>
                                <a href="${track.external_urls?.spotify || track.url}" 
                                   target="_blank" 
                                   class="btn btn-spotify btn-sm w-100">
                                    <i class="fab fa-spotify"></i> Listen on Spotify
                                </a>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}