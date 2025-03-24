const { SlashCommandBuilder, EmbedBuilder, InteractionResponseFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency and status')
        .setDMPermission(true),
    
    async execute(interaction, client) { // Fixed parameter order
        const startTime = Date.now();
        
        // Get latency metrics
        const heartbeat = client.ws.ping;
        const roundtrip = Date.now() - interaction.createdTimestamp;

        // Build embed
        const embed = new EmbedBuilder()
            .setColor(this.getStatusColor(heartbeat))
            .setTitle('📊 System Performance')
            .addFields(
                { name: '🌐 WebSocket', value: `${heartbeat}ms`, inline: true },
                { name: '⚡ Response', value: `${roundtrip}ms`, inline: true },
                { name: '🔄 Uptime', value: this.formatUptime(client.uptime), inline: true }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ 
            embeds: [embed],
            fetchReply: true 
        });
    },

    getStatusColor(latency) {
        if (latency < 150) return '#00ff00';
        if (latency < 300) return '#ffff00';
        return '#ff0000';
    },

    formatUptime(ms) {
        const days = Math.floor(ms / 86400000);
        const hours = Math.floor(ms / 3600000) % 24;
        const minutes = Math.floor(ms / 60000) % 60;
        return `${days}d ${hours}h ${minutes}m`;
    }
};