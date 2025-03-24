const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

function readBlacklist(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, '[]');
            return [];
        }
        
        const data = fs.readFileSync(filePath, 'utf8').trim();
        if (!data) {
            fs.writeFileSync(filePath, '[]');
            return [];
        }
        
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) {
            fs.writeFileSync(filePath, '[]');
            return [];
        }
        return parsed;
    } catch (error) {
        console.error(`Repairing ${filePath}`);
        fs.writeFileSync(filePath, '[]');
        return [];
    }
}
module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const userListPath = path.join(__dirname, '../blacklistLogs/blacklistuser.json');
        const serverListPath = path.join(__dirname, '../blacklistLogs/blacklistserver.json');
        
        const userBlacklist = readBlacklist(userListPath);
        const serverBlacklist = readBlacklist(serverListPath);

        if (userBlacklist.includes(message.author.id)) {
            return message.reply('⛔ You are blacklisted!');
        }

        if (message.guild && serverBlacklist.includes(message.guild.id)) {
            return message.reply('⛔ Server is blacklisted!');
        }

        // Prefix commands handling
        const prefix = '!';
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) ||
                        client.commands.find(cmd => cmd.aliases?.includes(commandName));

        if (!command) return;

        if (command.slashOnly) {
            return message.reply('🔍 This command is only available as a slash command!');
        }

        if (command.guildOnly && !message.guild) {
            return message.reply('❌ This command can only be used in servers!');
        }

        if (command.userPermissions) {
            const member = message.member;
            if (!member.permissions.has(command.userPermissions)) {
                return message.reply(`🚫 You need ${command.userPermissions.join(', ')} permissions!`);
            }
        }

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            message.reply({ embeds: [
                new EmbedBuilder()
                    .setColor('#ff0000')
                    .setDescription('❌ Error executing command!')
            ]});
        }
    }
};