const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Gives My Invite Link'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
    .setColor('#5865F2')
	.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setDescription("🥳 [Click For Invite](https://discord.com/oauth2/authorize?client_id=1289992637650047097&permissions=8&integration_type=0&scope=bot+applications.commands) | [Click For My Support Server](https://discord.gg/xnK6HxJqSp)")
	.setFooter({ text:  `${interaction.user.tag} Named User Used.`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
	.setTimestamp()

     interaction.reply({ embeds: [embed], ephemeral: true });
    }
}