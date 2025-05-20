// Handler for Discord message events
const { getCustomCommands } = require('../utils/storage');

// Handle message commands (using prefix)
async function handleMessage(client, message) {
  if (message.author.bot) return;
  
  // Handle regular text commands with a prefix (!)
  if (message.content.startsWith('!')) {
    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    // Check for custom command
    const customCommands = getCustomCommands();
    if (customCommands.has(command)) {
      message.channel.send(customCommands.get(command));
    }
  }
}

module.exports = { handleMessage };
