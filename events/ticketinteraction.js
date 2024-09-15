const { Events, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const logChannelId = '1284792138177187843'; // Log channel ID
        const logChannel = interaction.guild?.channels.cache.get(logChannelId);
        const ticketCategoryId = '1284817802636824576'; // Tickets category ID

        try {
            if (interaction.isStringSelectMenu()) {
                await interaction.deferReply({ ephemeral: true });

                if (interaction.customId === 'ticket_select') {
                    const ticketType = interaction.values[0]; // Get the selected ticket type
                    let channelName = '';
                    let mentionId = '';

                    // Determine the channel name and mention ID based on the ticket type
                    switch (ticketType) {
                        case 'general_support':
                            channelName = 'generalsupport';
                            mentionId = '1284792046074331136';
                            break;
                        case 'civilian_report':
                            channelName = 'civilian report';
                            mentionId = '1284792046074331136';
                            break;
                        case 'staff_report':
                            channelName = 'staff report';
                            mentionId = '1284792038231113758';
                            break;
                        default:
                            channelName = 'ticket';
                            mentionId = ''; // Default mention ID if needed
                            break;
                    }

                    // Find the ticket category by ID
                    const ticketCategory = interaction.guild.channels.cache.get(ticketCategoryId);
                    if (!ticketCategory || ticketCategory.type !== ChannelType.GuildCategory) {
                        // Handle the case where the category is not found or is not a category
                        if (logChannel) {
                            const errorEmbed = new EmbedBuilder()
                                .setTitle('Ticket Category Not Found')
                                .setDescription('The "Tickets" category with the provided ID was not found or is not a category.')
                                .setColor('#ff0000');

                            await logChannel.send({ embeds: [errorEmbed] });
                        }
                        await interaction.editReply({ content: 'Ticket category not found.', ephemeral: true });
                        return;
                    }

                    // Create a new channel for the ticket
                    const ticketChannel = await interaction.guild.channels.create({
                        name: `${channelName}-${interaction.user.username}`,
                        type: ChannelType.GuildText,
                        parent: ticketCategory,
                        topic: `Created by: ${interaction.user.id} | Opened at: ${Math.floor(Date.now() / 1000)}`,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                        ],
                    });

                    // Ping the appropriate role before sending the embed
                    if (mentionId) {
                        await ticketChannel.send(`<@&${mentionId}>`);
                    }

                    // Send initial message to the ticket channel
                    const openTime = Math.floor(Date.now() / 1000); // Define openTime here

                    const embed = new EmbedBuilder()
                        .setTitle('Snowville | Ticket')
                        .setDescription(`Hello ${interaction.user}, your ticket has been created. A support staff member will assist you soon. Please wait patiently.
                            
                            Open Time: <t:${openTime}:f>`)
                        .setThumbnail("https://cdn.discordapp.com/attachments/1284485057058439168/1284788237944098866/image.png?ex=66e7e7ca&is=66e6964a&hm=874b1fcc1f468acee240ec19f361cb474f6b31913e309d36a00365efcb6bb084&")
                        .setColor('#f3ca9a');

                    const closeButton = new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('Close Ticket')
                        .setStyle(ButtonStyle.Danger);

                    const row = new ActionRowBuilder()
                        .addComponents(closeButton);

                    await ticketChannel.send({ embeds: [embed], components: [row] });

                    await interaction.editReply({ content: `Your ticket has been created: ${ticketChannel}`, ephemeral: true });
                }
            } else if (interaction.isButton()) {
                if (interaction.customId === 'close_ticket') {
                    // Ensure interaction is deferred before further processing
                    if (!interaction.replied) {
                        await interaction.deferReply(); // Defer reply to ensure timely response
                    }

                    // Extract open time from channel topic
                    const channelTopic = interaction.channel?.topic || '';
                    const openTimeStr = channelTopic.split(' | ')[1]?.split('Opened at: ')[1];
                    const openTime = openTimeStr ? parseInt(openTimeStr) : Math.floor(Date.now() / 1000);
                    const closeTime = Math.floor(Date.now() / 1000);

                    // Extract user ID from channel topic
                    const userId = channelTopic.split('Created by: ')[1]?.split(' | ')[0];
                    if (!userId) {
                        await interaction.editReply({ content: 'Failed to extract user ID from channel topic.', ephemeral: true });
                        return;
                    }

                    const transcriptsDir = path.join(__dirname, 'transcripts');
                    if (!fs.existsSync(transcriptsDir)) {
                        fs.mkdirSync(transcriptsDir, { recursive: true });
                    }

                    const messages = await interaction.channel?.messages.fetch();
                    const transcript = 
                    `<html>
                    <head>
                        <meta charSet="utf-8"/>
                        <meta name="viewport" content="width=device-width, initial-scale=1"/>
                        <title>${interaction.channel?.name}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #36393f; color: white; }
                            .container { max-width: 900px; margin: 0 auto; padding: 20px; background-color: #2f3136; border-radius: 8px; }
                            .message { padding: 10px; border-bottom: 1px solid #444; }
                            .author { font-weight: bold; }
                            .timestamp { color: #72767d; font-size: 0.8em; }
                            .content { white-space: pre-wrap; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>${interaction.channel?.name}</h1>
                            <p>Opened by: <@${userId}> at <t:${openTime}:f></p>
                            <p>Closed by: <@${interaction.user.id}> at <t:${closeTime}:f></p>
                            <h2>Messages</h2>
                            ${messages?.map(message => 
                                `<div class="message">
                                    <div class="author">${message.author.username} (${message.author.id})</div>
                                    <div class="timestamp"><t:${Math.floor(message.createdTimestamp / 1000)}:f></div>
                                    <div class="content">${message.content}</div>
                                </div>`
                            ).join('')}
                        </div>
                    </body>
                    </html>`;

                    const transcriptPath = path.join(transcriptsDir, `${interaction.channel.id}.html`);
                    fs.writeFileSync(transcriptPath, transcript);

                    // Notify the user via DM
                    try {
                        const user = await interaction.client.users.fetch(userId);
                        const userDM = await user.createDM();
                        const dmEmbed = new EmbedBuilder()
                            .setTitle('Ticket Closed')
                            .setDescription('Thank you for opening a ticket. Above you can find your ticket transcript.')
                            .addFields(
                                { name: 'Open Time', value: `<t:${openTime}:f>` },
                                { name: 'Close Time', value: `<t:${closeTime}:f>` },
                                { name: 'Closed by', value: `<@${interaction.user.id}>` }
                            )
                            .setColor('#f3ca9a');

                        await userDM.send({ embeds: [dmEmbed], files: [transcriptPath] });
                    } catch (dmError) {
                        console.warn('Error sending DM to user:', dmError.message);
                    }

                    // Delete the ticket channel
                    try {
                        await interaction.channel.delete();
                    } catch (deleteError) {
                        console.error('Error deleting ticket channel:', deleteError);
                    }

                    // Log ticket closure details
                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('Ticket Closed')
                            .setDescription(`Ticket channel ${interaction.channel.name} has been closed.`)
                            .addFields(
                                { name: 'Opened by', value: `<@${userId}>` },
                                { name: 'Closed by', value: `<@${interaction.user.id}>` },
                                { name: 'Open Time', value: `<t:${openTime}:f>` },
                                { name: 'Close Time', value: `<t:${closeTime}:f>` }
                            )
                            .setColor('#f3ca9a');

                        await logChannel.send({ embeds: [logEmbed] });
                    }
                }
            }
        } catch (error) {
            console.error('Unexpected error during interaction handling:', error.message);
            // Do not log error details if you do not want to log them
        }
    },
};
