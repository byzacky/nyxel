const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vunmute')
        .setDescription('Unmute a user in the voice channel.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to unmute')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers), // Only allow users with Mute Members permission
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(targetUser.id);

        if (!member || !member.voice.channel) {
            return interaction.reply({ content: '❌| The user is not in a voice channel.', ephemeral: true });
        }

        try {
            await member.voice.setMute(false);
            await interaction.reply(`✅ | ${targetUser.tag} has been unmuted in the voice channel.`);
        } catch (error) {
            console.error('Error unmuting user in voice channel:', error);
            await interaction.reply({ content: '❌| There was an error trying to unmute the user in the voice channel.', ephemeral: true });
        }
    },
};
