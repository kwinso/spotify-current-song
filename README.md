# Spotify Watcher
This script is created to print currently playing song on spotify.  
It uses Spotify's Web API, so it kinda watches for every device.

# Setup
- Download the [Spotify Tui](https://github.com/Rigellute/spotify-tui#installation) and log in via the app.
- Then, open `~/.config/spotify-tui/.spotify_token_cache.json` and find `refresh_token` field, copy it.  
- Paste refresh token to `creds.json` file, which is relative to the script.
- Also provide `clientId` and `clientSecret` from your [Spotify Dashboard](https://developer.spotify.com/dashboard/) (must be the same as **Spotify Tui** used).
- `npm install` before the run

# Output Format
Output format is `Track - Artist`.

# Arguments
1. Update timeout in seconds
2. Length of truncation in characters  
Example:
```bash
node spotify.js 5 120
```
> Defautl update timeout is 5 seconds
> Default truncation length is 60
### Polybar config
```ini
[module/spotify]
type = custom/script
format = <label>
; Allows to run node.js file from everywhere, 
; by default you can run it only in the same dir where the main file is located
; * Add number at the end of this string to specify truncation length
exec = /usr/bin/npm run run --silent --prefix /path/to/script_directory 
tail = true
```
> You can add your fields, but these four are **required**

# Listenning mode.
This feauture allows to set volume of your player to pretty low number (`default=20`). This can be usefull when you try to quickly listen to some voice message or see a vid, but it's a lot of time to go to the spotify player. 
Script's called `listenning_mode.js`

### Polybar config
```ini
# 20 is the number volume will be dropped to
click-left = /usr/bin/npm run --prefix /home/mouse/.config/polybar/scripts/spotify listenning 20
```
> This field also can be added to the `Current Track` script, so you can use it in tandem, just add the live above to the `Current Track`'s polybar config.
