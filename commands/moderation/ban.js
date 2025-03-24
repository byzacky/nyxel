const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Check if the interaction is in a guild
        if (!interaction.guild) {
            return interaction.reply({ content: '❌| This command can only be used in a server.', ephemeral: true });
        }

        // Fetch the guild members to ensure the bot and user objects are valid
        try {
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

            // Prevent self-banning
            if (targetUser.id === interaction.user.id) {
                return interaction.reply({ content: '❌| You cannot ban **yourself**!', ephemeral: true });
            }

            // Fetch the member to ban
            const memberToBan = await interaction.guild.members.fetch(targetUser.id);

            // Check if the user to ban has a higher role than the bot
            if (memberToBan.roles.highest.position >= botMember.roles.highest.position) {
                return interaction.reply({ content: `❌| I cannot ban ${targetUser.tag}, they have a higher role than me.`, ephemeral: true });
            }

            // Ban the member
            await memberToBan.ban({ reason });
            return interaction.reply({ content: `✅ | Successfully banned ${targetUser.tag} for: ${reason}`, ephemeral: true });

        } catch (error) {
            console.error('Error banning user:', error);
            return interaction.reply({ content: '❌| There was an error trying to ban the user.', ephemeral: true });
        }
    },
};
