const fs = require("fs");
const path = require("path");
const axios = require("axios");


const credsFile = fs.readFileSync(path.join(__dirname, "./creds.json"));

let { accessToken, refreshToken, clientId, clientSecret } = JSON.parse(credsFile.toString());

module.exports = {
	refreshToken,
	clientId,
	clientSecret,

	getAccessToken() {
		return accessToken;
	},

	saveAccessToken(newAccessToken) {
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
};
