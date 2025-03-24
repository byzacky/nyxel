const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vdeafen')
        .setDescription('Deafen a user in the voice channel.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to deafen')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers), // Only allow users with Mute Members permission
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(targetUser.id);

        if (!member || !member.voice.channel) {
            return interaction.reply({ content: '❌| The user is not in a voice channel.', ephemeral: true });
        }

        try {
            await member.voice.setDeaf(true);
            await interaction.reply(`✅ | ${targetUser.tag} has been deafened in the voice channel.`);
        } catch (error) {
            console.error('Error deafening user in voice channel:', error);
            await interaction.reply({ content: '❌| There was an error trying to deafen the user in the voice channel.', ephemeral: true });
        }
    },
};
