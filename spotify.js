const axios = require("axios").default;
const path = require("path");
const fs = require("fs");

const truncLen = parseInt(process.argv[2]) || 60;

const credsFile = fs.readFileSync(path.join(__dirname, "./creds.json"));

let { accessToken, refreshToken, clientId, clientSecret } = JSON.parse(credsFile);
let output = "";

setInterval(async () => {

    try {
        const { data } = await axios.get(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
            }
        );

        if (data && data.is_playing) {
                const byArtist = data.item.artists[0].name;
                const song = data.item.name;

                let output = `${byArtist} - ${song}`;

                if (output.length > truncLen) {
                    output = output.substr(0, truncLen - 3) + "...";
                }
        }
    } catch (e) {
        if (e.response && (e.response.status == 400 || e.response.status == 401)) {
            await getNewAccessToken();
        } else {
            output = "Error getting current song.";
            saveError(e);
        }
    }

    console.log(output);
}, 5000);



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
        saveError(e);
        output = "Error getting new access token.";
    }

}

function saveAccessToken(newAccessToken) {
    accessToken = newAccessToken;
    fs.writeFileSync(
        path.join(__dirname, "./creds.json"),
        JSON.stringify(
            {
                accessToken: newAccessToken,
                refreshToken,
                clientId,
                clientSecret
            },
            null,
            4 // Formatting
        )
    );
}

function saveError(e) {
    const errMsg = `Error Date: ${new Date().toString()}\nError:\n${JSON.stringify(e, null, 4)}\n==============\n`;
    fs.writeFileSync(path.join(__dirname, "./errors.log"), errMsg, { flag: "a" });
}
