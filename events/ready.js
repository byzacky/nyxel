const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        // Update presence on startup
        const updatePresence = () => {
            client.user.setPresence({
                activities: [{
                    name: `${client.guilds.cache.size} servers | /help`,
                    type: ActivityType.Streaming,
                    url: 'https://www.twitch.tv/byzacky2'
                }],
                status: 'online'
            });
        };

        // Initial update
        updatePresence();
        
        // Update every 5 minutes
        setInterval(updatePresence, 300000);

        console.log(`Logged in as ${client.user.tag}! Serving ${client.guilds.cache.size} servers`);
    }
};