// Music functionality module
const { EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { getMusicQueue } = require('../utils/storage');

// Play command handler
async function handlePlay(interaction, query) {
  const queue = getMusicQueue();
  const voiceChannel = interaction.member.voice.channel;
  
  if (!voiceChannel) {
    return interaction.reply('You need to be in a voice channel to play music!');
  }
  
  const permissions = voiceChannel.permissionsFor(interaction.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return interaction.reply('I need permissions to join and speak in your voice channel!');
  }
  
  await interaction.deferReply();
  
  let song;
  
  if (ytdl.validateURL(query)) {
    const songInfo = await ytdl.getInfo(query);
    song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      duration: formatDuration(songInfo.videoDetails.lengthSeconds),
    };
  } else {
    const videoResult = await ytSearch(query);
    if (videoResult.videos.length === 0) {
      return interaction.editReply('No search results found!');
    }
    const video = videoResult.videos[0];
    song = {
      title: video.title,
      url: video.url,
      duration: video.duration.timestamp,
    };
  }
  
  let serverQueue = queue.get(interaction.guildId);
  
  if (!serverQueue) {
    const queueConstruct = {
      voiceChannel,
      connection: null,
      songs: [],
      player: createAudioPlayer(),
      playing: true,
    };
    
    queue.set(interaction.guildId, queueConstruct);
    queueConstruct.songs.push(song);
    
    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
      
      queueConstruct.connection = connection;
      connection.subscribe(queueConstruct.player);
      
      playSong(interaction.guild, queueConstruct.songs[0]);
      
      await interaction.editReply(`🎵 Now playing: **${song.title}**`);
    } catch (error) {
      console.error(error);
      queue.delete(interaction.guildId);
      return interaction.editReply('There was an error connecting to the voice channel!');
    }
  } else {
    serverQueue.songs.push(song);
    return interaction.editReply(`🎵 **${song.title}** has been added to the queue!`);
  }
}

function playSong(guild, song) {
  const queue = getMusicQueue();
  const serverQueue = queue.get(guild.id);
  
  if (!song) {
    serverQueue.connection.destroy();
    queue.delete(guild.id);
    return;
  }
  
  try {
    const stream = ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 });
    const resource = createAudioResource(stream);
    
    serverQueue.player.play(resource);
    
    serverQueue.player.on(AudioPlayerStatus.Idle, () => {
      serverQueue.songs.shift();
      playSong(guild, serverQueue.songs[0]);
    });
    
    serverQueue.player.on('error', error => {
      console.error(error);
      serverQueue.songs.shift();
      playSong(guild, serverQueue.songs[0]);
    });
  } catch (error) {
    console.error(error);
    serverQueue.songs.shift();
    playSong(guild, serverQueue.songs[0]);
  }
}

async function handleSkip(interaction) {
  const queue = getMusicQueue();
  const serverQueue = queue.get(interaction.guildId);
  
  if (!interaction.member.voice.channel) {
    return interaction.reply('You need to be in a voice channel to skip music!');
  }
  
  if (!serverQueue) {
    return interaction.reply('There is no song playing to skip!');
  }
  
  serverQueue.player.stop();
  await interaction.reply('⏭️ Skipped the current song');
}

async function handleStop(interaction) {
  const queue = getMusicQueue();
  const serverQueue = queue.get(interaction.guildId);
  
  if (!interaction.member.voice.channel) {
    return interaction.reply('You need to be in a voice channel to stop the music!');
  }
  
  if (!serverQueue) {
    return interaction.reply('There is no song playing to stop!');
  }
  
  serverQueue.songs = [];
  serverQueue.player.stop();
  await interaction.reply('⏹️ Music playback stopped and queue cleared');
}

async function handleQueue(interaction) {
  const queue = getMusicQueue();
  const serverQueue = queue.get(interaction.guildId);
  
  if (!serverQueue || serverQueue.songs.length === 0) {
    return interaction.reply('There are no songs in the queue!');
  }
  
  const queueEmbed = new EmbedBuilder()
    .setTitle('🎵 Music Queue')
    .setColor('#FF0000');
  
  let queueString = '';
  for (let i = 0; i < serverQueue.songs.length; i++) {
    queueString += `${i + 1}. **${serverQueue.songs[i].title}** (${serverQueue.songs[i].duration})\n`;
  }
  
  queueEmbed.setDescription(queueString);
  return interaction.reply({ embeds: [queueEmbed] });
}

// Helper functions
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  let result = '';
  if (hours > 0) {
    result += `${hours}:`;
  }
  
  result += `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  return result;
}

module.exports = {
  handlePlay,
  handleSkip,
  handleStop,
  handleQueue
};
