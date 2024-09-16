const { Events, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const logChannelId = '1284792138177187843'; // Log channel ID
        const logChannel = interaction.guild?.channels.cache.get(logChannelId);
        const ticketCategoryId = '1284817802636824576'; // Tickets category ID
        const generalStaffRoleId = '1284792046074331136'; // General staff role ID for most tickets
        const staffReportRoleId = '1284792038231113758'; // Staff report role ID

        try {
            if (interaction.isStringSelectMenu()) {
                await interaction.deferReply({ ephemeral: true });

                if (interaction.customId === 'ticket_select') {
                    const ticketType = interaction.values[0]; // Get the selected ticket type
                    let channelName = '';
                    let mentionId = '';
                    let allowedRoleId = ''; // This will store the allowed role ID for the specific ticket type

                    // Determine the channel name, mention ID, and allowed role based on the ticket type
                    switch (ticketType) {
                        case 'general_support':
                            channelName = 'generalsupport';
                            mentionId = generalStaffRoleId;
                            allowedRoleId = generalStaffRoleId; // Allow general staff role
                            break;
                        case 'civilian_report':
                            channelName = 'civilian-report';
                            mentionId = generalStaffRoleId;
                            allowedRoleId = generalStaffRoleId; // Allow general staff role
                            break;
                        case 'staff_report':
                            channelName = 'staff-report';
                            mentionId = staffReportRoleId;
                            allowedRoleId = staffReportRoleId; // Allow specific staff role for staff reports
                            break;
                        default:
                            channelName = 'ticket';
                            mentionId = '';
                            allowedRoleId = ''; // No specific role allowed for default
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

                    // Create a new channel for the ticket with the correct permissions
                    const ticketChannel = await interaction.guild.channels.create({
                        name: `${channelName}-${interaction.user.username}`,
                        type: ChannelType.GuildText,
                        parent: ticketCategory,
                        topic: `Created by: ${interaction.user.id} | Opened at: ${Math.floor(Date.now() / 1000)}`,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel], // Deny everyone by default
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel], // Allow the ticket opener
                            },
                            {
                                id: allowedRoleId,
                                allow: [PermissionsBitField.Flags.ViewChannel], // Allow the specific staff role
                            }
                        ],
                    });

                    // Ping the appropriate role before sending the embed
                    if (mentionId) {
                        await ticketChannel.send(`<@&${mentionId}>`);
                    }

                    // Send initial message to the ticket channel
                    const openTime = Math.floor(Date.now() / 1000);

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
            }
        } catch (error) {
            console.error('Error handling interaction:', error);
        }
    },
};
