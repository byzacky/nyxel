const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vundeafen')
        .setDescription('Undeafen a user in the voice channel.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to undeafen')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers), // Only allow users with Mute Members permission
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(targetUser.id);

        if (!member || !member.voice.channel) {
            return interaction.reply({ content: '❌| The user is not in a voice channel.', ephemeral: true });
        }

        try {
            await member.voice.setDeaf(false);
            await interaction.reply(`✅ | ${targetUser.tag} has been undeafened in the voice channel.`);
        } catch (error) {
            console.error('Error undeafening user in voice channel:', error);
            await interaction.reply({ content: '❌| There was an error trying to undeafen the user in the voice channel.', ephemeral: true });
        }
    },
};
