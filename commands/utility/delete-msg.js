const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-msg')
        .setDescription('Deletes a specified number of messages from the channel.')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('The number of messages to delete (1-100)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Requires Manage Messages permission
    async execute(interaction) {
        const count = interaction.options.getInteger('count');

        if (count < 1 || count > 100) {
            return interaction.reply({ content: 'Please specify a number between 1 and 100.', ephemeral: true });
        }

        try {
            await interaction.channel.bulkDelete(count, true);
            await interaction.reply({ content: `Successfully deleted ${count} messages.`, ephemeral: true });
        } catch (error) {
            console.error('Error deleting messages:', error);
            await interaction.reply({ content: 'There was an error trying to delete messages in this channel.', ephemeral: true });
        }
    },
};
