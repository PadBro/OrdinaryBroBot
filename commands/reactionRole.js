import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('reaction-role')
  .setDescription('Handles reaction roles on the server')
  .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
  // /reactionrole add message:<link> emoji:<emoji> role:<role>
  // /reactionrole list
  // /reactionrole remove
  .addSubcommand((subcommand) =>
    subcommand
      .setName('add')
      .setDescription('Adds a reaction role to a message.')
      .addStringOption((option) =>
        option
          .setName('message')
          .setDescription('The message link to add the reaction to.')
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('emoji')
          .setDescription('The emoji to react with.')
          .setRequired(true),
      )
      .addRoleOption((option) =>
        option
          .setName('role')
          .setDescription('The role to assing/remove if reacted.')
          .setRequired(true),
      ),
  );

export const execute = async (interaction) => {
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case 'add':
      addReactionRole(interaction);
      break;
    default:
      interaction.reply('command not found');
  }
};

const addReactionRole = async (interaction) => {
  const discordChannelLinkBase = 'https://discord.com/channels/'
  const emojiRegex = /^(\p{Emoji})$/u
  const discordEmojiRegex = /^<.+:([0-9]+)>$/
  let reactionEmoji = null;

  const messageLink = interaction.options.getString('message');
  const emoji = interaction.options.getString('emoji');

  if (!messageLink.includes(discordChannelLinkBase)) {
    interaction.reply('not discord channel link');
    return
  }

  const [guildId, channelId, messageId] = messageLink.replace(discordChannelLinkBase, '').split('/')
  console.log(guildId, channelId, messageId)
  if (guildId !== interaction.guild.id) {
    interaction.reply('not from right server');
    return
  }

  const channel = await interaction.guild.channels.fetch(channelId)
  if (!channel) {
    interaction.reply('Channel not found');
    return
  }
  const message = await channel.messages.fetch(messageId)
  if (!message) {
    interaction.reply('Message not found');
    return
  }
  console.log(channel)
  console.log(message)

  if (emojiRegex.test(emoji)) {
    reactionEmoji = emoji
  }

  const match = emoji.match(discordEmojiRegex);
  if (!reactionEmoji && match) {
    const serverEmoji = interaction.guild.emojis.cache.find(guildEmoji => guildEmoji.id === `${match[1]}`)
    if (serverEmoji) {
      reactionEmoji = serverEmoji.id;
    }
  }

  if (!reactionEmoji) {
    interaction.reply('emoji not found');
    return
  }

  const reply = await interaction.reply({content: 'found', fetchReply: true});
  reply.react(reactionEmoji)
  return;
}
