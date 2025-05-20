// Main entry point for the Discord bot
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { setupCommands } = require('./commands/commandHandler');
const { handleInteraction } = require('./handlers/interactionHandler');
const { handleMessage } = require('./handlers/messageHandler');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Register when the client is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  setupCommands(client);
});

// Handle interactions (slash commands)
client.on('interactionCreate', async interaction => {
  handleInteraction(client, interaction);
});

// Message command handling
client.on('messageCreate', async message => {
  handleMessage(client, message);
});

// Login to Discord
client.login(process.env.TOKEN);
