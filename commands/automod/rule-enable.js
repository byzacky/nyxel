const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod-rule-enable')
        .setDescription('Enable an AutoMod rule')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Rule name to enable')
                .setRequired(true)),
    
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
            if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                return interaction.reply({ 
                    content: '❌ You need **Manage Server** permission!', 
                    ephemeral: true 
                });
            }

            // Find and enable rule
            const rules = await interaction.guild.autoModerationRules.fetch();
            const rule = rules.find(r => r.name === interaction.options.getString('name'));
            
            if (!rule) {
                return interaction.reply({ 
                    content: '❌ Rule not found!', 
                    ephemeral: true 
                });
            }

            await rule.edit({ enabled: true });
            await interaction.reply({ 
                content: `✅ Enabled rule: ${rule.name}`, 
                ephemeral: true 
            });
            
        } catch (error) {
            console.error(error);
            interaction.reply({ 
                content: '❌ Failed to enable rule!', 
                ephemeral: true 
            });
        }
    }
};