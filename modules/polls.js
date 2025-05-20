// Polls and voting system module
const { EmbedBuilder } = require('discord.js');
const { getActivePolls } = require('../utils/storage');

// Create a new poll
function createPoll(interaction, question, optionsString, duration) {
  const activePolls = getActivePolls();
  const options = optionsString.split('|').map(option => option.trim());
  
  if (options.length < 2 || options.length > 10) {
    return interaction.reply('You must provide between 2 and 10 options for the poll!');
  }
  
  const pollId = Date.now().toString();
  
  const pollData = {
    question,
    options,
    votes: Array(options.length).fill(0),
    voters: new Map(),
    endTime: Date.now() + duration * 60000,
  };
  
  activePolls.set(pollId, pollData);
  
  // Create poll embed
  const pollEmbed = new EmbedBuilder()
    .setTitle(`📊 Poll: ${question}`)
    .setColor('#0099FF')
    .setDescription(
      options.map((option, index) => `${index + 1}. ${option}`).join('\n\n') +
      `\n\n*Poll ID: ${pollId}*\n*Vote using /vote ${pollId} <option number>*\n*Poll ends in ${duration} minutes*`
    )
    .setFooter({ text: `Poll created by ${interaction.user.username}` })
    .setTimestamp();
  
  interaction.reply({ embeds: [pollEmbed] });
  
  // End the poll after the duration
  setTimeout(() => {
    endPoll(interaction, pollId);
  }, duration * 60000);
}

// Handle a vote in a poll
function handleVote(interaction, pollId, optionNumber) {
  const activePolls = getActivePolls();
  const pollData = activePolls.get(pollId);
  
  if (!pollData) {
    return interaction.reply('Poll not found or has ended!');
  }
  
  if (Date.now() > pollData.endTime) {
    activePolls.delete(pollId);
    return interaction.reply('This poll has ended!');
  }
  
  if (optionNumber < 1 || optionNumber > pollData.options.length) {
    return interaction.reply(`Please choose an option between 1 and ${pollData.options.length}!`);
  }
  
  const userId = interaction.user.id;
  
  // If user already voted, subtract their previous vote
  if (pollData.voters.has(userId)) {
    const previousVote = pollData.voters.get(userId);
    pollData.votes[previousVote - 1]--;
  }
  
  // Add the new vote
  pollData.votes[optionNumber - 1]++;
  pollData.voters.set(userId, optionNumber);
  
  interaction.reply({ content: `You voted for: "${pollData.options[optionNumber - 1]}"`, ephemeral: true });
}

// End a poll and display results
function endPoll(interaction, pollId) {
  const activePolls = getActivePolls();
  const pollData = activePolls.get(pollId);
  
  if (!pollData) return;
  
  activePolls.delete(pollId);
  
  const maxVotes = Math.max(...pollData.votes);
  const winners = pollData.votes
    .map((votes, index) => ({ option: pollData.options[index], votes, index }))
    .filter(option => option.votes === maxVotes);
  
  let resultMessage = `📊 Poll results for: "${pollData.question}"\n\n`;
  
  // Add all options and their vote counts
  pollData.options.forEach((option, index) => {
    const percentage = pollData.voters.size > 0 
      ? Math.round((pollData.votes[index] / pollData.voters.size) * 100) 
      : 0;
    
    resultMessage += `${index + 1}. ${option}: ${pollData.votes[index]} votes (${percentage}%)\n`;
  });
  
  resultMessage += `\nTotal votes: ${pollData.voters.size}\n`;
  
  // Announce winner(s)
  if (pollData.voters.size > 0) {
    if (winners.length === 1) {
      resultMessage += `\n🏆 Winner: "${winners[0].option}" with ${winners[0].votes} votes!`;
    } else {
      resultMessage += `\n🏆 Tie between: ${winners.map(w => `"${w.option}"`).join(', ')} with ${maxVotes} votes each!`;
    }
  } else {
    resultMessage += "\nNo votes were cast in this poll.";
  }
  
  const channel = interaction.channel;
  channel.send(resultMessage);
}

module.exports = {
  createPoll,
  handleVote,
  endPoll
};
