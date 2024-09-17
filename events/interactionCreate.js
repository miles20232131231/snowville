const { InteractionType } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        try {
            // Handle Slash Commands
            if (interaction.isCommand()) {
                const { commands } = client;
                const command = commands.get(interaction.commandName);
                if (command) {
                    await command.execute(interaction, client);
                }
            }
            
            // Handle Button Interactions
            else if (interaction.isButton()) {
                const customId = interaction.customId;

                // Check for specific button ID (e.g., 'bannedVehicleList')
                if (customId === 'bannedVehicleList') {
                    // Send the Google Docs link when the button is clicked
                    await interaction.reply({
                        content: 'https://docs.google.com/document/d/1hNoYMil7oEzHnIwUxXbAmop43zf8aoWQuA8T8WKQFlQ/edit?usp=sharing',
                        ephemeral: true  // Only the user who clicked the button will see this message
                    });
                }

                // Add more button handlers as needed
            }

            // You can also add other interaction types, like modals or select menus, here if needed
        } catch (error) {
            console.error(error);
        }
    },
};
