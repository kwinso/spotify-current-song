# Spotify Watcher
This script is created to print currently playing song on spotify.  
It uses Spotify's Web API, so it kinda watches for every device.

# Setup
- Download the [Spotify Tui](https://github.com/Rigellute/spotify-tui#installation).  
- Then, open `~/.config/spotify-tui/.spotify_token_cache.json` and find `refresh_token` field, copy it.  
- Paste refresh token to `creds.json` file, which is relative to the script.
- Also provide `clientId` and `clientSecret` from your [Spotify Dashboard](https://developer.spotify.com/dashboard/) (must be the same as **Spotify Tui** used).
- `npm install` before the run

# Running
If you have ~~big booty~~ wide screen, you can pass your own length of truncation. It's the first parameter for the script
```bash
node spotify.js 120
```
> Default truncation length is 60

# Polybar config
```ini
[module/spotify]
type = custom/script
format = <label>
; Allows to run node.js file from everywhere, 
; by default you can run it only in the same dir where the main file is located
exec = /usr/bin/npm run run --silent --prefix /home/mouse/.config/polybar/scripts/spotify 
tail = true
```
> You can add your fields, but these four are **required**

## Note
As soon as you see a message about error in the bar, you can check `errors.log` file, script prints there every error, just not to break your bar