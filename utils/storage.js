// Storage utilities for the bot
// Handles global state (queues, polls, custom commands)

// Global variables for music functionality
const musicQueue = new Map();

// Global variables for polls
const activePolls = new Map();

// Custom commands storage
const customCommands = new Map();

// Export the storage objects
module.exports = {
  getMusicQueue: () => musicQueue,
  getActivePolls: () => activePolls,
  getCustomCommands: () => customCommands
};
