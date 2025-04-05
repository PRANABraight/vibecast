const CLIENT_ID = 'b5b05ff2ffba40cf926a64d762ab1a66';
const CLIENT_SECRET = '33015ba0d40941d1a00a8742886913f3';

let tokenData = null;

export async function getSpotifyToken() {
    if (tokenData && Date.now() < tokenData.expiresAt) {
        return tokenData.token;
    }

    const authOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    };

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
        const data = await response.json();
        
        if (data.access_token) {
            tokenData = {
                token: data.access_token,
                expiresAt: Date.now() + (data.expires_in * 1000)
            };
            return data.access_token;
        }
        throw new Error('No access token received');
    } catch (error) {
        console.error('Token Error:', error);
        throw error;
    }
}
