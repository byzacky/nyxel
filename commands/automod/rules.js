const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod-rules')
        .setDescription('List all AutoMod rules'),
    
    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ 
                content: '❌ This command can only be used in servers!', 
                ephemeral: true 
            });
        }

        try {
            // Permission check
            const member = await interaction.guild.members.fetch(interaction.user.id);
            if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                return interaction.reply({ 
                    content: '❌ You need **Manage Server** permission!', 
                    ephemeral: true 
                });
            }

            const rules = await interaction.guild.autoModerationRules.fetch();
            const embed = new EmbedBuilder()
                .setTitle('🔒 AutoMod Rules')
                .setColor('#0099ff');

            if (rules.size === 0) {
                embed.setDescription('No AutoMod rules configured');
            } else {
                rules.forEach(rule => {
                    const actions = rule.actions.map(action => {
                        if (action.type === 'Timeout') {
                            return `Timeout (${action.metadata.durationSeconds}s)`;
                        }
                        return action.type;
                    });
                    
                    embed.addFields({
                        name: `${rule.name} [${rule.enabled ? '🟢' : '🔴'}]`,
                        value: `**Trigger:** ${rule.triggerType}\n**Actions:** ${actions.join(', ')}`
                    });
                });
            }

            await interaction.reply({ 
                embeds: [embed], 
                ephemeral: true 
            });
            
        } catch (error) {
            console.error(error);
            interaction.reply({ 
                content: '❌ Failed to fetch rules!', 
                ephemeral: true 
            });
        }
    }
};