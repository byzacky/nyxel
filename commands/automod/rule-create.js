const { SlashCommandBuilder, PermissionFlagsBits, AutoModerationRuleEventType, AutoModerationRuleTriggerType, AutoModerationActionType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod-rule-create')
        .setDescription('Create a new AutoMod rule')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Rule name')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('words')
                .setDescription('Comma-separated banned words')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('timeout')
                .setDescription('Timeout duration (e.g., 30s, 5m, 2h)')),
    
    async execute(interaction) {
        if (!interaction.guild) {
            return interaction.reply({ 
                content: '❌ This command can only be used in servers!', 
                ephemeral: true 
            });
        }

        try {
            // Permission checks
            const member = await interaction.guild.members.fetch(interaction.user.id);
            const botMember = await interaction.guild.members.fetch(interaction.client.user.id);
            
            if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                return interaction.reply({ 
                    content: '❌ You need **Manage Server** permission!', 
                    ephemeral: true 
                });
            }
            
            if (!botMember.permissions.has(PermissionFlagsBits.ManageGuild)) {
                return interaction.reply({ 
                    content: '❌ I need **Manage Server** permission!', 
                    ephemeral: true 
                });
            }

            // Parse timeout
            const timeoutInput = interaction.options.getString('timeout');
            let durationSeconds = 0;
            
            if (timeoutInput) {
                const match = timeoutInput.match(/^(\d+)(s|m|h|d|w)$/i);
                if (!match) {
                    return interaction.reply({ 
                        content: '❌ Invalid timeout format! Use: 30s, 5m, 2h, 1d, 1w', 
                        ephemeral: true 
                    });
                }
                
                const [, amount, unit] = match;
                const multipliers = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 };
                durationSeconds = parseInt(amount) * multipliers[unit.toLowerCase()];
            }

            // Create rule
            const rule = await interaction.guild.autoModerationRules.create({
                name: interaction.options.getString('name'),
                eventType: AutoModerationRuleEventType.MessageSend,
                triggerType: AutoModerationRuleTriggerType.Keyword,
                triggerMetadata: {
                    keywordFilter: interaction.options.getString('words').split(',').map(w => w.trim())
                },
                actions: [{
                    type: AutoModerationActionType.Timeout,
                    metadata: { durationSeconds }
                }],
                enabled: true
            });

            await interaction.reply({ 
                content: `✅ Created AutoMod rule: ${rule.name}`, 
                ephemeral: true 
            });
            
        } catch (error) {
            console.error(error);
            interaction.reply({ 
                content: '❌ Failed to create rule!', 
                ephemeral: true 
            });
        }
    }
};