const axios = require("axios").default;

const updateTime = parseInt(process.argv[2]) || 5;
const truncLen = parseInt(process.argv[3]) || 60; 

const {
    refreshToken,
    clientSecret,
    clientId,
    saveAccessToken,
    getAccessToken
} = require("./tokens.js");

let output = "";
let nextSongCheck = 0;

setInterval(async () => {
    let oldOutput = output;
    try {
        if (Date.now() > nextSongCheck) {
            const { data, status } = await axios.get(
                "https://api.spotify.com/v1/me/player/currently-playing",
                {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getAccessToken()}`
                    },
                }
            );

            output = ""

            if (data && data.is_playing) {
                const byArtist = data.item.artists[0].name;
                const song = data.item.name;

                output = `${song} - ${byArtist}`;

                if (output.length > truncLen)
                    output = output.substr(0, truncLen - 3).trim() + "...";
            }

            // API sends 204 if there's no content, so script will check a little bit later to decrease
            // requests amount and update output
            if (status == 204) {
                // Check again for song 10 seconds later
                nextSongCheck = Date.now() + 1000 * 10;
            }
        }
    } catch (e) {
        output = "Error getting current song.";
        if (e.response) {
            const status = e.response.status;
            output = "Error with API";

            if (status == 401 || status == 400) {
                output = "Refresing Access Token"
                await getNewAccessToken();
            } else if (status == 503)
                output = "API Timeout...";
        }
    }

    if (output != oldOutput)
        console.log(output);
}, updateTime * 1000);


async function getNewAccessToken() {
    try {
        const { data } = await axios.post(
            "https://accounts.spotify.com/api/token",
            `grant_type=refresh_token&refresh_token=${refreshToken}`,
            {
                headers: {
                    "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
                }
            }
        );
        saveAccessToken(data.access_token);
    } catch (e) {
        output = "Error getting new access token.";
    }

}
