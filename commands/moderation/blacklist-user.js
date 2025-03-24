const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist-user')
        .setDescription('Blacklist a user from using the bot')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to blacklist')
                .setRequired(true)),
    
    async execute(interaction) {
        // Permission check
        if (interaction.user.id !== process.env.ADMINID) {
            return interaction.reply({ 
                content: '❌ You do not have permission to use this command!',
                ephemeral: true 
            });
        }

        const user = interaction.options.getUser('user');
        const filePath = path.join(__dirname, '../../blacklistLogs/blacklistuser.json');

        try {
            // Read and validate existing data
            let blacklistData = { blacklistedUsers: [] };
            if (fs.existsSync(filePath)) {
                const rawData = fs.readFileSync(filePath, 'utf8').trim();
                if (rawData) {
                    try {
                        blacklistData = JSON.parse(rawData);
                        if (!Array.isArray(blacklistData.blacklistedUsers)) {
                            blacklistData.blacklistedUsers = [];
                        }
                    } catch (error) {
                        console.error('Resetting corrupted file');
                        blacklistData = { blacklistedUsers: [] };
                    }
                }
            }

            // Validate user ID
            if (!user.id || typeof user.id !== 'string') {
                return interaction.reply('❌ Invalid user provided!');
            }

            // Check if already blacklisted
            if (blacklistData.blacklistedUsers.includes(user.id)) {
                return interaction.reply(`❌ ${user.tag} is already blacklisted!`);
            }

            // Add to blacklist
            blacklistData.blacklistedUsers.push(user.id);
            fs.writeFileSync(filePath, JSON.stringify(blacklistData, null, 2));

            interaction.reply(`✅ Successfully blacklisted ${user.tag} (ID: ${user.id})`);
        } catch (error) {
            console.error(error);
            interaction.reply('❌ Failed to blacklist user!');
        }
    }
};