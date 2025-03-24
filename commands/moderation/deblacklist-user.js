const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deblacklist-user')
        .setDescription('Remove user from blacklist')
        .addStringOption(option =>
            option.setName('user-id')
                .setDescription('User ID to unblacklist')
                .setRequired(true)),
    
    async execute(interaction) {
        if (interaction.user.id !== process.env.ADMINID) {
            return interaction.reply({ 
                content: '❌ No permission!',
                ephemeral: true 
            });
        }

        const userId = interaction.options.getString('user-id');
        const filePath = path.join(__dirname, '../../blacklistLogs/blacklistuser.json');

        try {
            let blacklistData = { blacklistedUsers: [] };
            
            if (fs.existsSync(filePath)) {
                const rawData = fs.readFileSync(filePath, 'utf8').trim();
                if (rawData) {
                    try {
                        blacklistData = JSON.parse(rawData);
                        // Ensure blacklistedUsers exists and is an array
                        if (!Array.isArray(blacklistData.blacklistedUsers)) {
                            blacklistData.blacklistedUsers = [];
                        }
                    } catch (error) {
                        console.error('Resetting corrupted file');
                        blacklistData = { blacklistedUsers: [] };
                    }
                }
            }

            // Check if user ID exists in array
            if (!blacklistData.blacklistedUsers.includes(userId)) {
                return interaction.reply(`❌ User ${userId} not found in blacklist!`);
            }

            // Remove user ID
            blacklistData.blacklistedUsers = blacklistData.blacklistedUsers.filter(id => id !== userId);
            fs.writeFileSync(filePath, JSON.stringify(blacklistData, null, 2));
            
            interaction.reply(`✅ Removed ${userId} from blacklist`);
        } catch (error) {
            console.error(error);
            interaction.reply('❌ Failed to remove from blacklist!');
        }
    }
};