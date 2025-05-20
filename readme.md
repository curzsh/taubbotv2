# Discord Music & Poll Bot written by Claude AI

A versatile Discord bot that provides music playing capabilities, polls/voting systems, and custom commands for your Discord server.

## Features

### 🎵 Music Commands
- `/play <song name or URL>` - Play a song from YouTube
- `/skip` - Skip the current song
- `/stop` - Stop playback and clear queue
- `/queue` - View the current music queue

### 📊 Poll System
- `/poll <question> <options> [duration]` - Create a poll with options separated by |
- `/vote <poll_id> <option_number>` - Vote in an active poll

### 💬 Custom Commands
- `/command add <name> <response>` - Create a custom command
- `/command remove <name>` - Remove a custom command
- `/command list` - List all custom commands
- Use custom commands with `!commandname` or `/commandname`

## Setup

### Prerequisites
- Node.js 16.6.0 or higher
- npm (Node Package Manager)
- A Discord Bot Token from the [Discord Developer Portal](https://discord.com/developers/applications)

### Installation

1. Clone this repository or download the files
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your Discord bot token and client ID:
   ```
   TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_client_id_here
   ```
4. Start the bot:
   ```
   npm start
   ```

### Adding the Bot to Your Server

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Navigate to the "OAuth2" tab
4. In "URL Generator", select the following scopes:
   - `bot`
   - `applications.commands`
5. Select the following bot permissions:
   - Send Messages
   - Embed Links
   - Attach Files
   - Read Message History
   - Add Reactions
   - Connect (to voice channels)
   - Speak (in voice channels)
6. Copy the generated URL and open it in your browser
7. Select the server you want to add the bot to

## Hosting

For 24/7 operation, consider hosting your bot on a service like:
- [Heroku](https://www.heroku.com/)
- [Railway](https://railway.app/)
- [Replit](https://replit.com/)
- A VPS provider (DigitalOcean, AWS, etc.)

## Dependencies

- [discord.js](https://discord.js.org/) - Discord API wrapper
- [@discordjs/voice](https://discord.js.org/#/docs/voice/main/general/welcome) - Voice functionality
- [ytdl-core](https://github.com/fent/node-ytdl-core) - YouTube downloading
- [yt-search](https://github.com/talmobi/yt-search) - YouTube searching
- [dotenv](https://github.com/motdotla/dotenv) - Environment variable management

## License

This project is available under the MIT License. Feel free to modify and use it for your own Discord server!
