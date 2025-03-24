const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deblacklist-server')
        .setDescription('Remove server from blacklist')
        .addStringOption(option =>
            option.setName('server-id')
                .setDescription('Server ID to unblacklist')
                .setRequired(true)),
    
    async execute(interaction) {
        if (interaction.user.id !== process.env.ADMINID) {
            return interaction.reply({ 
                content: '❌ No permission!',
                ephemeral: true 
            });
        }

        const serverId = interaction.options.getString('server-id');
        const filePath = path.join(__dirname, '../../blacklistLogs/blacklistserver.json');

        try {
            let blacklistData = { blacklistedServers: [] };
            if (fs.existsSync(filePath)) {
                const rawData = fs.readFileSync(filePath, 'utf8').trim();
                blacklistData = rawData ? JSON.parse(rawData) : { blacklistedServers: [] };
            }

            if (!blacklistData.blacklistedServers.includes(serverId)) {
                return interaction.reply(`Server ${serverId} not blacklisted!`);
            }

            blacklistData.blacklistedServers = blacklistData.blacklistedServers.filter(id => id !== serverId);
            fs.writeFileSync(filePath, JSON.stringify(blacklistData, null, 2));
            interaction.reply(`✅ Removed server ${serverId} from blacklist`);
        } catch (error) {
            console.error(error);
            interaction.reply('❌ Failed to deblacklist!');
        }
    }
};