const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

const dataFolderPath = path.join(__dirname, '../../data/vehicleData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unregister')
        .setDescription('Unregister a vehicle from your profile.')
        .addStringOption(option =>
            option.setName('model')
                .setDescription('The model of the vehicle to unregister.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('make')
                .setDescription('The make of the vehicle to unregister.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('The color of the vehicle to unregister.')
                .setRequired(false)),

    async execute(interaction) {
        try {
            const model = interaction.options.getString('model');
            const make = interaction.options.getString('make');
            const color = interaction.options.getString('color');

            const user = interaction.user;
            const userId = user.id;
            const userFilePath = path.join(dataFolderPath, `${userId}.json`);

            let userVehicles = [];
            if (fs.existsSync(userFilePath)) {
                userVehicles = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
            }

            if (userVehicles.length === 0) {
                return interaction.reply({ content: 'You have no vehicles registered to unregister.', ephemeral: true });
            }

            // Find matching vehicles
            const matchingVehicles = userVehicles.filter(vehicle =>
                (!model || vehicle.model === model) &&
                (!make || vehicle.make === make) &&
                (!color || vehicle.color === color)
            );

            if (matchingVehicles.length === 0) {
                return interaction.reply({ content: 'No matching vehicles found to unregister.', ephemeral: true });
            }

            // Unregister the first matching vehicle
            const vehicleToRemove = matchingVehicles[0];
            userVehicles = userVehicles.filter(vehicle =>
                !(vehicle.model === vehicleToRemove.model &&
                vehicle.make === vehicleToRemove.make &&
                vehicle.color === vehicleToRemove.color)
            );

            if (userVehicles.length > 0) {
                fs.writeFileSync(userFilePath, JSON.stringify(userVehicles, null, 2), 'utf8');
            } else {
                fs.unlinkSync(userFilePath);
            }

            const confirmationEmbed = new EmbedBuilder()
                .setTitle('Vehicle Unregistered')
                .setDescription(`**Year:** ${vehicleToRemove.year}\n**Make:** ${vehicleToRemove.make}\n**Model:** ${vehicleToRemove.model}\n**Trim:** ${vehicleToRemove.trim}\n**Color:** ${vehicleToRemove.color}\n**Number Plate:** ${vehicleToRemove.numberPlate}`)
                .setColor(`#f3ca9a`);

            await interaction.reply({
                embeds: [confirmationEmbed],
                ephemeral: true
            });

        } catch (error) {
            console.error('Error unregistering vehicle:', error);
            await interaction.reply({ content: 'Failed to unregister vehicle.', ephemeral: true });
        }
    },
};
