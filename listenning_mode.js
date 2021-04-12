// Track info: GET https://api.spotify.com/v1/me/player
// Set volume PUT https://api.spotify.com/v1/me/player/volume

const axios = require("axios").default;
const { getAccessToken  } = require("./tokens");

const listenningVolume = parseInt(process.argv[2]) || 20;

async function getCurrentVolume() {

    try {
        const { data } = await axios.get(
            "https://api.spotify.com/v1/me/player",
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getAccessToken()}`
                },
            }
        );
        return data.device.volume_percent;
    } catch {
        return 100;
    }
}

async function toggleListenningMode() {
    try {
        const currentVolume = await getCurrentVolume();
        const volumeToSet = currentVolume == listenningVolume ? 100 : listenningVolume;
        await axios.put(
            `https://api.spotify.com/v1/me/player/volume?volume_percent=${volumeToSet}`,
            "",
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getAccessToken()}`
                },
            }
        );
    } catch (e) { 
        console.log(e.response.data.error);
    }
}

toggleListenningMode();
