require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { CLIENT_ID, TOKEN } = process.env;
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const readCommands = (dir = 'commands') => {
    const commandsPath = path.join(__dirname, dir);
    const commandFiles = fs.readdirSync(commandsPath, { withFileTypes: true });

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file.name);
        if (file.isDirectory()) {
            readCommands(path.join(dir, file.name));
        } else if (file.name.endsWith('.js')) {
            const command = require(filePath);
            commands.push(command.data.toJSON());
        }
    }
};

readCommands();

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`Refreshing ${commands.length} commands...`);
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );
        console.log(`Successfully reloaded ${data.length} commands!`);
    } catch (error) {
        console.error(error);
    }
})();