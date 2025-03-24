const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get information about a user.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to get information about')
                .setRequired(false)), // Optional user target, defaults to the command user if not provided
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(targetUser.id);

        const roles = member.roles.cache.map(role => role).slice(0, 10).join(', ') || 'None';
        const isBoosting = member.premiumSince ? 'Yes' : 'No';
        const joinedServer = `<t:${Math.floor(member.joinedTimestamp / 1000)}:F> (${Math.floor((Date.now() - member.joinedTimestamp) / (1000 * 60 * 60 * 24 * 365))} years and ${Math.floor(((Date.now() - member.joinedTimestamp) / (1000 * 60 * 60 * 24)) % 365)} days ago)`;
        const accountCreated = `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F> (${Math.floor((Date.now() - targetUser.createdTimestamp) / (1000 * 60 * 60 * 24 * 365))} years and ${Math.floor(((Date.now() - targetUser.createdTimestamp) / (1000 * 60 * 60 * 24)) % 365)} days ago)`;
        const globalPermissions = member.permissions.has(PermissionFlagsBits.Administrator) ? 'Administrator (all permissions)' : 'None';

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`👤 USER INFORMATION 👤`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Username', value: `${targetUser.username}`, inline: true },
                { name: 'User ID', value: `${targetUser.id}`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true }, // Empty space for alignment
                { name: 'Roles [up to 10]', value: roles, inline: true },
                { name: 'Nickname', value: `${member.nickname || 'None'}`, inline: true },
                { name: 'Boosting', value: isBoosting, inline: true },
                { name: 'Global Permissions', value: globalPermissions, inline: false },
                { name: 'Joined this server on (MM/DD/YYYY)', value: joinedServer, inline: false },
                { name: 'Account created on (MM/DD/YYYY)', value: accountCreated, inline: false }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
