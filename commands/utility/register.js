const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataDirPath = path.join(__dirname, '../../data/vehicleData');

// Define the role-specific limits
const roleLimits = {
    '1284792063694733334': 4, // Register up to 4 vehicles
    '1284792066466906206': 6, // Register up to 6 vehicles
    '1284792067612086374': 10 // Register up to 10 vehicles
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register your vehicle.')
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('Vehicle Year')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('make')
                .setDescription('Vehicle Make')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('model')
                .setDescription('Vehicle Model')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('trim')
                .setDescription('Vehicle Trim')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Vehicle Color')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('number-plate')
                .setDescription('Vehicle Number Plate')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const year = interaction.options.getInteger('year');
            const make = interaction.options.getString('make');
            const model = interaction.options.getString('model');
            const trim = interaction.options.getString('trim');
            const color = interaction.options.getString('color');
            const numberPlate = interaction.options.getString('number-plate');
            const userId = interaction.user.id;

            // Ensure the data directory exists
            if (!fs.existsSync(dataDirPath)) {
                fs.mkdirSync(dataDirPath, { recursive: true });
            }

            const userFilePath = path.join(dataDirPath, `${userId}.json`);

            // Load existing vehicle data for the user
            let vehicleData = [];
            if (fs.existsSync(userFilePath)) {
                vehicleData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
            }

            // Determine the maximum number of vehicles allowed based on the user's roles
            const member = await interaction.guild.members.fetch(userId);
            const roles = member.roles.cache;
            let maxVehicles = 0;

            for (const [roleId, role] of roles) {
                if (roleLimits[roleId]) {
                    maxVehicles = Math.max(maxVehicles, roleLimits[roleId]);
                }
            }

            // Check if the user has reached their vehicle registration limit
            if (vehicleData.length >= maxVehicles) {
                const limitEmbed = new EmbedBuilder()
                    .setTitle('Registration Limit Reached')
                    .setDescription(`You have reached the maximum number of vehicles you can register (${maxVehicles}).`)
                    .setColor(`#f3ca9a`);
                await interaction.editReply({ embeds: [limitEmbed] });
                return;
            }

            // Add the new vehicle data
            vehicleData.push({ year, make, model, trim, color, numberPlate });

            // Save the updated vehicle data back to the file
            fs.writeFileSync(userFilePath, JSON.stringify(vehicleData, null, 2), 'utf8');

            console.log(`Vehicle data saved: ${JSON.stringify(vehicleData, null, 2)}`); // Debugging line

            // Create an ephemeral embed to confirm the registration to the user
            const successEmbed = new EmbedBuilder()
                .setTitle('Vehicle Registered')
                .setDescription(`Your vehicle has been successfully registered. Execute the command /profile to view your vehicles.`)
                .setColor(`#f3ca9a`);

            // Confirm the registration to the user with an ephemeral message
            await interaction.editReply({ embeds: [successEmbed] });

        } catch (error) {
            console.error('Error processing vehicle registration:', error);
            await interaction.editReply({ content: 'There was an error while processing your request.', ephemeral: true });
        }
    },
};
