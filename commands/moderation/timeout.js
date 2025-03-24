const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms'); // npm package for human-readable durations

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user for a specified duration.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to timeout')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('The duration of the timeout (e.g., 1w for 1 week, 1h for 1 hour, 1m for 1 minute)')
                .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const duration = interaction.options.getString('duration');

        // Check if the interaction is in a guild
        if (!interaction.guild) {
            return interaction.reply({ content: '❌| This command can only be used in a server.', ephemeral: true });
        }

        // Check if the bot has permission to timeout members
        const botMember = await interaction.guild.members.fetch(interaction.client.user.id);
        if (!botMember.permissions.has('MODERATE_MEMBERS')) {
            return interaction.reply({ content: '❌| I do not have the **MODERATE MEMBERS** permission.', ephemeral: true });
        }

        // Check if the user executing the command has permission to timeout members
        const member = await interaction.guild.members.fetch(interaction.user.id);
        if (!member.permissions.has('MODERATE_MEMBERS')) {
            return interaction.reply({ content: '❌| You do not have **MODERATE MEMBERS** permission to use this command.', ephemeral: true });
        }

        // Prevent self-timeout
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({ content: '❌| You cannot timeout yourself!', ephemeral: true });
        }

        // Validate the duration
        const timeoutDuration = ms(duration);
        if (!timeoutDuration) {
            return interaction.reply({ content: '❌| Invalid duration format. Please use a format like 1w, 1h, 1m.', ephemeral: true });
        }

        try {
            // Fetch the member to timeout
            const memberToTimeout = await interaction.guild.members.fetch(targetUser.id);

            // Check if the user to timeout has a higher role than the bot
            if (memberToTimeout.roles.highest.position >= botMember.roles.highest.position) {
                return interaction.reply({ content: `❌| I cannot timeout ${targetUser.tag}, they have a higher role than me.`, ephemeral: true });
            }

            // Set the timeout
            await memberToTimeout.timeout(timeoutDuration, `Timed out by ${interaction.user.tag} for ${duration}`);
            return interaction.reply({ content: `✅ | Successfully timed out ${targetUser.tag} for ${duration}.`, ephemeral: true });

        } catch (error) {
            console.error('Error timing out user:', error);
            return interaction.reply({ content: '❌| There was an error trying to timeout the user. Please make sure the user ID is correct and try again.', ephemeral: true });
        }
    },
};
