const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

const ticketsDirPath = path.join(__dirname, '../../data/tickets');
const rolesFilePath = path.join(__dirname, '../../data/registeredRoles.json');

// Ensure the tickets directory exists
if (!fs.existsSync(ticketsDirPath)) {
    fs.mkdirSync(ticketsDirPath, { recursive: true });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Create a new ticket.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user for whom the ticket is being created.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('offense')
                .setDescription('The offense for the ticket')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('price')
                .setDescription('The price for the ticket')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('The count for the ticket')
                .setRequired(true)),

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
                    .setColor('#FF0000'); // Red color for error

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Load registered roles
            let registeredRoles = {};
            if (fs.existsSync(rolesFilePath)) {
                registeredRoles = JSON.parse(fs.readFileSync(rolesFilePath, 'utf8'));
            }

            // Get the LEO role ID from the registeredRoles.json
            const leoRoleId = registeredRoles[interaction.guild.id]?.leoRoleId;
            if (!leoRoleId) {
                return interaction.reply({ content: 'LEO role ID not found in the configuration.', ephemeral: true });
            }

            // Check if the user has the LEO role
            if (!interaction.member.roles.cache.has(leoRoleId)) {
                const embed = new EmbedBuilder()
                    .setTitle('Role Not Found')
                    .setDescription('You do not have permission to use this command.')
                    .setColor(`#f3ca9a`); // Red color for error

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const user = interaction.options.getUser('user');
            const offense = interaction.options.getString('offense');
            const price = interaction.options.getInteger('price');
            const count = interaction.options.getInteger('count');
            const userId = user.id;

            const ticketFilePath = path.join(ticketsDirPath, `${userId}.json`);

            // Prepare the ticket data
            const ticketData = {
                offense,
                price,
                count,
                date: new Date()
            };

            // Save the ticket data to a file
            let tickets = [];
            if (fs.existsSync(ticketFilePath)) {
                tickets = JSON.parse(fs.readFileSync(ticketFilePath, 'utf8'));
            }
            tickets.push(ticketData);
            fs.writeFileSync(ticketFilePath, JSON.stringify(tickets, null, 2), 'utf8');

            const replyEmbed = new EmbedBuilder()
                .setTitle('Ticket Created')
                .setDescription(`The ticket for <@${userId}> has been created successfully.`)
                .addFields(
                    { name: 'Offense', value: offense, inline: true },
                    { name: 'Price', value: price.toString(), inline: true },
                    { name: 'Count', value: count.toString(), inline: true }
                )
                .setColor(`#f3ca9a`);


            await interaction.reply({ embeds: [replyEmbed], ephemeral: true });

        } catch (error) {
            console.error('Error creating ticket:', error);
            await interaction.reply({ content: 'Failed to create the ticket.', ephemeral: true });
        }
    },
};
