const { Events, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
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
            // Handle Select Menu Interactions
            if (interaction.isStringSelectMenu() && interaction.customId === 'information_select') {
                await handleStringSelectMenu(interaction);
            }
            // Handle Button Interactions
            else if (interaction.isButton()) {
                await handleButtonInteraction(interaction);
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
    let components = [];

    switch (interaction.values[0]) {
        case 'ess':
            const essEmbed = new EmbedBuilder()
                .setDescription('*Coming soon*')
                .setColor(0Xf3ca9a);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    embeds: [essEmbed],
                    ephemeral: true
                });
            }
            break;

        case 'sguild':
            const sguildEmbed = new EmbedBuilder()
                .setDescription(`1.General Conduct
Be respectful to all members. No harassment, discrimination, or bullying.
Keep conversations appropriate for all ages. No excessive swearing or NSFW content.
Avoid drama and arguments. Keep the server positive.

2. Roleplay Etiquette
Roleplay should be realistic and respectful to others' characters.
No metagaming or using OOC knowledge in IC scenarios.

3. In-Game Rules
Follow traffic laws and roleplay realistically. No random or intentional killing (RDM/VDM).
In accidents, roleplay the situation properly.

4. Use of Vehicles
Use appropriate vehicles and avoid excessive customizations.
Check the banned vehicle list regularly.

5. Session Rules
Follow staff instructions and don’t interrupt ongoing roleplays.
Respect the seriousness of strict RP sessions.

6. Use of Discord
Use channels appropriately and avoid spamming.
Be respectful in voice chats and stick to RP guidelines.

7. Staff and Administration
Respect staff decisions and report issues through proper channels.
Don’t engage directly with rulebreakers.

8. Punishments
Warnings for minor offenses, bans for serious or repeated violations.
Use the appeal process for disputes.

9. Event Participation
Follow event rules and assigned roles during special events.

10. Miscellaneous
Keep roleplay creative but realistic.
English is the primary language, and no cheating or exploiting is allowed.`)
             .setColor(0Xf3ca9a);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    embeds: [sguildEmbed],
                    ephemeral: true
                });
            }
            break;

        case 'sping':
            const sessionPingEmbed = new EmbedBuilder()
                .setTitle('Session Ping')
                .setDescription('Press the button below to receive the <@&1284796401049669643> role.')
                .setColor(`#f3ca9a`);

            const pingButton = new ButtonBuilder()
                .setCustomId('toggle_ping')
                .setLabel('Session Ping')
                .setStyle(ButtonStyle.Primary);

            components.push(new ActionRowBuilder().addComponents(pingButton));
            embedResponses.push(sessionPingEmbed);

            if (embedResponses.length > 0 && !interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    embeds: embedResponses,
                    components: components,
                    ephemeral: true
                });
            }
            break;
    }
}

async function handleButtonInteraction(interaction) {
    if (interaction.customId === 'toggle_ping') {
        const roleId1 = '1284796401049669643';
        const member = interaction.member;

        if (member.roles.cache.has(roleId1)) {
            await member.roles.remove(roleId1);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'The <@&1284796401049669643> role has been removed from you.',
                    ephemeral: true
                });
            }
        } else {
            await member.roles.add(roleId1);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'You have been granted the <@&1284796401049669643> role.',
                    ephemeral: true
                });
            }
        }
    }
}
