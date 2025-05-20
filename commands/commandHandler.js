// Command registration and definitions
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

// Export for use in other modules
module.exports.setupCommands = async function(client) {
  const commands = [
    // Music commands
    {
      name: 'play',
      description: 'Play music from YouTube',
      options: [
        {
          name: 'query',
          type: ApplicationCommandOptionType.String,
          description: 'Song name or YouTube URL',
          required: true,
        },
      ],
    },
    {
      name: 'skip',
      description: 'Skip the current song',
    },
    {
      name: 'stop',
      description: 'Stop the music and clear the queue',
    },
    {
      name: 'queue',
      description: 'Show the current music queue',
    },

    // Poll commands
    {
      name: 'poll',
      description: 'Create a poll',
      options: [
        {
          name: 'question',
          type: ApplicationCommandOptionType.String,
          description: 'The poll question',
          required: true,
        },
        {
          name: 'options',
          type: ApplicationCommandOptionType.String,
          description: 'Poll options separated by | (e.g., "Yes|No|Maybe")',
          required: true,
        },
        {
          name: 'duration',
          type: ApplicationCommandOptionType.Integer,
          description: 'Poll duration in minutes (default: 5)',
          required: false,
        },
      ],
    },
    {
      name: 'vote',
      description: 'Vote in an active poll',
      options: [
        {
          name: 'poll_id',
          type: ApplicationCommandOptionType.String,
          description: 'The ID of the poll',
          required: true,
        },
        {
          name: 'option',
          type: ApplicationCommandOptionType.Integer,
          description: 'The option number to vote for',
          required: true,
        },
      ],
    },

    // Custom commands
    {
      name: 'command',
      description: 'Manage custom commands',
      options: [
        {
          name: 'add',
          type: ApplicationCommandOptionType.Subcommand,
          description: 'Add a new custom command',
          options: [
            {
              name: 'name',
              type: ApplicationCommandOptionType.String,
              description: 'Command name',
              required: true,
            },
            {
              name: 'response',
              type: ApplicationCommandOptionType.String,
              description: 'Command response',
              required: true,
            },
          ],
        },
        {
          name: 'remove',
          type: ApplicationCommandOptionType.Subcommand,
          description: 'Remove a custom command',
          options: [
            {
              name: 'name',
              type: ApplicationCommandOptionType.String,
              description: 'Command name to remove',
              required: true,
            },
          ],
        },
        {
          name: 'list',
          type: ApplicationCommandOptionType.Subcommand,
          description: 'List all custom commands',
        },
      ],
    },
  ];

  try {
    console.log('Started refreshing application (/) commands.');
    
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
};
