const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');

// Ensure the 'transcripts' directory exists
const transcriptDir = './transcripts';
if (!fs.existsSync(transcriptDir)) {
    fs.mkdirSync(transcriptDir, { recursive: true });
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            // Server Information Interaction
            if (interaction.isStringSelectMenu() && interaction.customId === 'information_select') {
                await handleStringSelectMenu(interaction);
            }
        } catch (error) {
            console.error(`Error handling interaction: ${error}`);
            if (!interaction.replied && !interaction.deferred) {
                try {
                    await interaction.reply({ content: 'An error occurred while handling your request.', ephemeral: true });
                } catch (replyError) {
                    console.error(`Failed to send error reply: ${replyError}`);
                }
            }
        }
    },
};

async function handleStringSelectMenu(interaction) {
    let embedResponses = [];

    switch (interaction.values[0]) {
        case 'rp2':
            const essEmbed = new EmbedBuilder()
                .setDescription(``)
.setColor(`#f3ca9a`);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    embeds: [essEmbed],
                    ephemeral: true
                });
            }
            break;

        case 'np':
            const sguildEmbed = new EmbedBuilder()
                .setDescription(`**1-3 Booster Perks**
                    <@&1284792069470158910>
                    <@&1282043753649143991>
                    <@&1284792066466906206>
                    <@&1284823743222386698>
                    25K eco per week
                    New Vehicle Registration Limit: 6
                    
                    **4+ Booster Perks**
                    100K per week
                    New Vehicle Registration Limit: 10`)
                    .setColor(`#f3ca9a`);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    embeds: [sguildEmbed],
                    ephemeral: true
                });
            }
            break;
    }
}
