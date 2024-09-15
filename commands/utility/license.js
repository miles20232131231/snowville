const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

const licensesDirPath = path.join(__dirname, '../../data/licenses');
const rolesFilePath = path.join(__dirname, '../../data/registeredRoles.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('license')
        .setDescription('Set the license status for a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose license status you want to set')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('status')
                .setDescription('The license status (valid or not)')
                .setRequired(true)
                .addChoices(
                    { name: 'Valid', value: 'valid' },
                    { name: 'Not Valid', value: 'not_valid' })), 

    async execute(interaction) {
        try {
            // Define allowed role IDs
            const allowedRoleIds = ['1284792055066923018', '1284792052529496104'];

            // Check if the member has one of the allowed roles
            const hasPermission = interaction.member.roles.cache.some(role => allowedRoleIds.includes(role.id));
            if (!hasPermission) {
                const embed = new EmbedBuilder()
                    .setTitle('Permission Denied')
                    .setDescription('You do not have the required role to use this command.')
                    .setColor('#FF0000');

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Load registered roles
            let registeredRoles = {};
            if (fs.existsSync(rolesFilePath)) {
                registeredRoles = JSON.parse(fs.readFileSync(rolesFilePath, 'utf8'));
            }

            const leoRoleId = registeredRoles[interaction.guild.id];
            if (!leoRoleId) {
                return interaction.reply({ content: 'Leo role not set. Please contact an admin.', ephemeral: true });
            }

            const leoRole = interaction.guild.roles.cache.get(leoRoleId);
            if (!leoRole) {
                return interaction.reply({ content: 'Leo role not found in the server.', ephemeral: true });
            }

            // Check if the user has the leo role
            if (!interaction.member.roles.cache.has(leoRole.id)) {
                const embed = new EmbedBuilder()
                    .setTitle('Role Not Found')
                    .setDescription('You do not have the required role to use this command.')
                    .setColor('#FF0000');

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const user = interaction.options.getUser('user');
            const status = interaction.options.getString('status');
            const userId = user.id;
            const filePath = path.join(licensesDirPath, `${userId}.json`);

            if (!fs.existsSync(licensesDirPath)) {
                fs.mkdirSync(licensesDirPath, { recursive: true });
            }

            const licenseData = { status, date: new Date() };
            fs.writeFileSync(filePath, JSON.stringify([licenseData], null, 2), 'utf8'); // Save as an array

            await interaction.reply({ content: `License status for <@${userId}> has been set to ${status}.`, ephemeral: true });
        } catch (error) {
            console.error('Error updating license status:', error);
            await interaction.reply({ content: 'Failed to set the license status.', ephemeral: true });
        }
    },
};
