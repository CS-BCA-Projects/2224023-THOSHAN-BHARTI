process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Get access token
async function getAccessToken() {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('✅ Access token retrieved successfully.');
    } catch (error) {
        console.error('❗ Error retrieving access token:', error);
    }
}

// Run the function at startup to get a token
(async () => {
    await getAccessToken();
})();

module.exports = { spotifyApi, getAccessToken };
