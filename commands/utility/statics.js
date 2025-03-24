const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment')
const os = require("os");
require("moment-duration-format");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stat')
        .setDescription('Shows My Static'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            withResponse: true,
        });
 
        const Uptime = moment
          .duration(client.uptime)
          .format(" D [day], H [hour], m [minute], s [second]");
        const embed = new EmbedBuilder()
          .addFields({ name: "Bot Owner", value: `<@865129062595035137>`, inline: false })
          .addFields({
            name: "• Bot Size (KB/MB/GB/TB)",
            value: `${(process.memoryUsage().heapUsed / 1024 / 512).toFixed(
              2
            )}MB`,
            inline: true,
          })
          .addFields({
            name: "• Uptime",
            value: `${Uptime}`,
            inline: true,
          })
          .addFields({
            name: "• Servers",
            value: `${client.guilds.cache.size}`,
            inline: false,
          })
          .addFields({
            name: "• Channels",
            value: `${client.channels.cache.size}`,
            inline: false,
          })
          .addFields({
            name: "• System",
            value: `${os.cpus().map((i) => `${i.model}`)[0]}`,
            inline: false,
          })
          .addFields({
            name: "• Discord.JS Version",
            value: `14.6.0`,
            inline: true,
          })
          .addFields({
            name: "• Ping",
            value: `${client.ws.ping}`,
            inline: true,
          });
        await interaction.editReply({
            embeds : [embed]    
        });
    }
}