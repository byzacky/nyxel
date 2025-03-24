const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

function readBlacklist(filePath, key) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, JSON.stringify({ [key]: [] }, null, 2));
            return [];
        }
        
        const data = fs.readFileSync(filePath, 'utf8').trim();
        if (!data) {
            fs.writeFileSync(filePath, JSON.stringify({ [key]: [] }, null, 2));
            return [];
        }
        
        const parsed = JSON.parse(data);
        if (!parsed[key] || !Array.isArray(parsed[key])) {
            fs.writeFileSync(filePath, JSON.stringify({ [key]: [] }, null, 2));
            return [];
        }
        return parsed[key];
    } catch (error) {
        console.error(`Repairing ${filePath}`);
        fs.writeFileSync(filePath, JSON.stringify({ [key]: [] }, null, 2));
        return [];
    }
}




module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const userList = readBlacklist(
            path.join(__dirname, '../blacklistLogs/blacklistuser.json'),
            'blacklistedUsers'
        );
        
        const serverList = readBlacklist(
            path.join(__dirname, '../blacklistLogs/blacklistserver.json'),
            'blacklistedServers'
        );

        if (userList.includes(interaction.user.id)) {
            return interaction.reply({ 
                content: '⛔ You have been blacklisted!',
                ephemeral: true 
            });
        }

        if (interaction.guild && serverList.includes(interaction.guild.id)) {
            return interaction.reply({ 
                content: '⛔ This server is blacklisted!',
                ephemeral: true 
            });
        }

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ Command error!',
                ephemeral: true
            });
        }
    
    }
};