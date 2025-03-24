const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vkick')
        .setDescription('Kick a user from the voice channel.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to kick')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers), // Only allow users with Mute Members permission
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(targetUser.id);

        if (!member || !member.voice.channel) {
            return interaction.reply({ content: '❌| The user is not in a voice channel.', ephemeral: true });
        }

        try {
            await member.voice.disconnect();
            await interaction.reply(`✅ | ${targetUser.tag} has been kicked from the voice channel.`);
        } catch (error) {
            console.error('Error kicking user from voice channel:', error);
            await interaction.reply({ content: '❌| There was an error trying to kick the user from the voice channel.', ephemeral: true });
        }
    },
};
