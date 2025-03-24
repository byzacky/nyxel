const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar of a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to get the avatar of')
                .setRequired(false)), // Optional target
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target') || interaction.user;

        const avatarEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`${targetUser.tag}'s Avatar`)
            .setImage(targetUser.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [avatarEmbed] });
    },
};
