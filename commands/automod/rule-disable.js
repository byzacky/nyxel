const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod-rule-disable')
        .setDescription('Disable an AutoMod rule')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Rule name to disable')
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

            // Find and disable rule
            const rules = await interaction.guild.autoModerationRules.fetch();
            const rule = rules.find(r => r.name === interaction.options.getString('name'));
            
            if (!rule) {
                return interaction.reply({ 
                    content: '❌ Rule not found!', 
                    ephemeral: true 
                });
            }

            await rule.edit({ enabled: false });
            await interaction.reply({ 
                content: `✅ Disabled rule: ${rule.name}`, 
                ephemeral: true 
            });
            
        } catch (error) {
            console.error(error);
            interaction.reply({ 
                content: '❌ Failed to disable rule!', 
                ephemeral: true 
            });
        }
    }
};