const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Remove a timeout from a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to remove the timeout from')
                .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');

        // Check if the interaction is in a guild
        if (!interaction.guild) {
            return interaction.reply({ content: '❌| This command can only be used in a server.', ephemeral: true });
        }
        //Prevent self-untimeout
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({ content: '❌| You cannot de-timeout yourself!', ephemeral: true });
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

        try {
            // Fetch the member to untimeout
            const memberToUntimeout = await interaction.guild.members.fetch(targetUser.id);

            // Check if the user to untimeout has a higher role than the bot
            if (memberToUntimeout.roles.highest.position >= botMember.roles.highest.position) {
                return interaction.reply({ content: `❌| I cannot remove the timeout from ${targetUser.tag}, they have a higher role than me.`, ephemeral: true });
            }

            // Check if the user is not timed out
            if (!memberToUntimeout.communicationDisabledUntil) {
                return interaction.reply({ content: `❌| ${targetUser.tag} is not currently timed out.`, ephemeral: true });
            }

            // Remove the timeout
            await memberToUntimeout.timeout(null, `Timeout removed by ${interaction.user.tag}`);
            return interaction.reply({ content: `✅ | Successfully removed the timeout from ${targetUser.tag}.`, ephemeral: true });

        } catch (error) {
            console.error('Error removing timeout:', error);
            return interaction.reply({ content: '❌| There was an error trying to remove the timeout. Please make sure the user ID is correct and try again.', ephemeral: true });
        }
    },
};
