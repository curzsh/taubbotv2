// Handler for Discord interaction events (slash commands)
const { handlePlay, handleSkip, handleStop, handleQueue } = require('../modules/music');
const { createPoll, handleVote } = require('../modules/polls');
const { addCustomCommand, removeCustomCommand, listCustomCommands } = require('../modules/customCommands');
const { getCustomCommands } = require('../utils/storage');

// Main interaction handler function
async function handleInteraction(client, interaction) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  // Music commands
  if (commandName === 'play') {
    const query = interaction.options.getString('query');
    handlePlay(interaction, query);
  }
  else if (commandName === 'skip') {
    handleSkip(interaction);
  }
  else if (commandName === 'stop') {
    handleStop(interaction);
  }
  else if (commandName === 'queue') {
    handleQueue(interaction);
  }
  
  // Poll commands
  else if (commandName === 'poll') {
    const question = interaction.options.getString('question');
    const optionsString = interaction.options.getString('options');
    const duration = interaction.options.getInteger('duration') || 5;
    createPoll(interaction, question, optionsString, duration);
  }
  else if (commandName === 'vote') {
    const pollId = interaction.options.getString('poll_id');
    const optionNumber = interaction.options.getInteger('option');
    handleVote(interaction, pollId, optionNumber);
  }
  
  // Custom commands
  else if (commandName === 'command') {
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'add') {
      const name = interaction.options.getString('name');
      const response = interaction.options.getString('response');
      addCustomCommand(interaction, name, response);
    }
    else if (subcommand === 'remove') {
      const name = interaction.options.getString('name');
      removeCustomCommand(interaction, name);
    }
    else if (subcommand === 'list') {
      listCustomCommands(interaction);
    }
  }
  
  // Check if it's a custom command
  else {
    const customCommands = getCustomCommands();
    if (customCommands.has(commandName)) {
      await interaction.reply(customCommands.get(commandName));
    }
  }
}

module.exports = { handleInteraction };
