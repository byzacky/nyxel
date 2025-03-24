const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the kick')
                .setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Check if the interaction is in a guild
        if (!interaction.guild) {
            return interaction.reply({ content: '❌| This command can only be used in a server.', ephemeral: true });
        }

        try {
            // Fetch the guild member objects
            const member = await interaction.guild.members.fetch(interaction.user.id);
            const botMember = await interaction.guild.members.fetch(interaction.client.user.id);

            // Check if the bot has permission to kick members
            if (!botMember.permissions.has('KICK_MEMBERS')) {
                return interaction.reply({ content: '❌| I do not have the **KICK MEMBERS** permission.', ephemeral: true });
            }

            // Check if the user executing the command has permission to kick members
            if (!member.permissions.has('KICK_MEMBERS')) {
                return interaction.reply({ content: '❌| You do not have **KICK MEMBERS** permission to use this command.', ephemeral: true });
            }

            // Prevent self-kicking
            if (targetUser.id === interaction.user.id) {
                return interaction.reply({ content: '❌| You cannot kick **yourself**!', ephemeral: true });
            }

            // Fetch the target member
            const memberToKick = await interaction.guild.members.fetch(targetUser.id);

            // Check if the target member has a higher role than the bot
            if (memberToKick.roles.highest.position >= botMember.roles.highest.position) {
                return interaction.reply({ content: `❌| I cannot kick ${targetUser.tag}, they have a higher role than me.`, ephemeral: true });
            }
            

            // Kick the member
            await memberToKick.kick(reason);
            return interaction.reply({ content: `✅ | Successfully kicked ${targetUser.tag} for: ${reason}`, ephemeral: true });

        } catch (error) {
            console.error('Error kicking user:', error);
            return interaction.reply({ content: '❌| There was an error trying to kick the user. Please make sure the user ID is correct and try again.', ephemeral: true });
        }
    },
};
