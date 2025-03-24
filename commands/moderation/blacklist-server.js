const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist-server')
        .setDescription('Blacklist a server from using the bot')
        .addStringOption(option =>
            option.setName('server-id')
                .setDescription('Server ID to blacklist')
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
            // Ensure directory exists
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            
            let blacklistData = { blacklistedServers: [] };
            if (fs.existsSync(filePath)) {
                const rawData = fs.readFileSync(filePath, 'utf8').trim();
                if (rawData) {
                    try {
                        blacklistData = JSON.parse(rawData);
                        if (!Array.isArray(blacklistData.blacklistedServers)) {
                            blacklistData.blacklistedServers = [];
                        }
                    } catch (error) {
                        console.error('Resetting corrupted file');
                        blacklistData = { blacklistedServers: [] };
                    }
                }
            }

            if (blacklistData.blacklistedServers.includes(serverId)) {
                return interaction.reply(`❌ Server ${serverId} already blacklisted!`);
            }

            blacklistData.blacklistedServers.push(serverId);
            fs.writeFileSync(filePath, JSON.stringify(blacklistData, null, 2));
            
            interaction.reply(`✅ Server ${serverId} blacklisted!`);
        } catch (error) {
            console.error(error);
            interaction.reply('❌ Failed to blacklist server!');
        }
    }
};