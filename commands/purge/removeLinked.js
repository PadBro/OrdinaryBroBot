const { SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();


module.exports = {
  data: new SlashCommandBuilder()
    .setName('removelinked')
    .setDescription('Removes the Linked role from every member'),
  async execute(interaction) {
    const memberRole = interaction.guild.roles.cache.get(process.env.MEMBER_ROLE_ID);
    const linkedRole = interaction.guild.roles.cache.get(process.env.LINKED_ROLE_ID);
    memberRole.members.map(m => m.roles.remove(linkedRole));
    await interaction.reply("placeholder");
  }
}