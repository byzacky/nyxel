const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user from the server.')
        .addStringOption(option =>
            option.setName('user_id')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the unban')
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const userId = interaction.options.getString('user_id');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Check if the interaction is in a guild
        if (!interaction.guild) {
            return interaction.reply({ content: '❌| This command can only be used in a server.', ephemeral: true });
        }

        try {
            // Fetch the guild member objects
            const member = await interaction.guild.members.fetch(interaction.user.id);
            const botMember = await interaction.guild.members.fetch(interaction.client.user.id);

            // Check if the bot has permission to ban members
            if (!botMember.permissions.has('BAN_MEMBERS')) {
                return interaction.reply({ content: '❌| I do not have the **BAN MEMBERS** permission.', ephemeral: true });
            }

            // Check if the user executing the command has permission to ban members
            if (!member.permissions.has('BAN_MEMBERS')) {
                return interaction.reply({ content: '❌| You do not have **BAN MEMBERS** permission to use this command.', ephemeral: true });
            }

            // Check if the user is banned
            const bannedUsers = await interaction.guild.bans.fetch();
            const isBanned = bannedUsers.has(userId);

            if (!isBanned) {
                return interaction.reply({ content: `❌| The user with ID ${userId} is not banned in this guild.`, ephemeral: true });
            }

            // Unban the user from the guild
            await interaction.guild.bans.remove(userId, reason);
            return interaction.reply({ content: `✅ | Successfully unbanned user with ID ${userId} for: ${reason}`, ephemeral: true });

        } catch (error) {
            console.error('Error unbanning user:', error);
            return interaction.reply({ content: '❌| There was an error trying to unban the user. Please make sure the user ID is correct and try again.', ephemeral: true });
        }
    },
};
