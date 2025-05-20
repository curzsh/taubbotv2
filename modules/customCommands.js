// Custom commands management module
const { getCustomCommands } = require('../utils/storage');

// Add a custom command
function addCustomCommand(interaction, name, response) {
  const customCommands = getCustomCommands();
  
  if (name.length < 1 || name.length > 20) {
    return interaction.reply('Command name must be between 1 and 20 characters!');
  }
  
  // Reserve standard command names
  const reservedCommands = ['play', 'skip', 'stop', 'queue', 'poll', 'vote', 'command'];
  if (reservedCommands.includes(name.toLowerCase())) {
    return interaction.reply(`Cannot create a custom command with name '${name}' as it's a reserved command name.`);
  }
  
  customCommands.set(name.toLowerCase(), response);
  interaction.reply(`✅ Custom command \`${name}\` has been added!`);
}

// Remove a custom command
function removeCustomCommand(interaction, name) {
  const customCommands = getCustomCommands();
  
  if (!customCommands.has(name.toLowerCase())) {
    return interaction.reply(`No custom command with name \`${name}\` exists!`);
  }
  
  customCommands.delete(name.toLowerCase());
  interaction.reply(`✅ Custom command \`${name}\` has been removed!`);
}

// List all custom commands
function listCustomCommands(interaction) {
  const customCommands = getCustomCommands();
  
  if (customCommands.size === 0) {
    return interaction.reply('No custom commands have been created yet!');
  }
  
  let commandList = '📋 **Custom Commands:**\n\n';
  
  [...customCommands.entries()].forEach(([name, response]) => {
    // Truncate long responses for display
    const truncatedResponse = response.length > 50 
      ? response.substring(0, 50) + '...' 
      : response;
    
    commandList += `• \`${name}\`: ${truncatedResponse}\n`;
  });
  
  interaction.reply(commandList);
}

module.exports = {
  addCustomCommand,
  removeCustomCommand,
  listCustomCommands
};
