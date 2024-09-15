const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('over')
        .setDescription('Purges messages from today between specified start and end times, excluding the first 2 messages.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('start-time')
                .setDescription('Start time in HH:MM format')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('end-time')
                .setDescription('End time in HH:MM format')
                .setRequired(true)),
    async execute(interaction) {
        console.log('Command execution started.');

        const startTime = interaction.options.getString('start-time');
        const endTime = interaction.options.getString('end-time');

        const now = new Date();
        const start = new Date(now);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        start.setHours(startHours, startMinutes, 0, 0);

        const end = new Date(now);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        end.setHours(endHours, endMinutes, 0, 0);

        if (start > end) {
            end.setDate(end.getDate() + 1); // Adjust end time if it's past midnight
        }

        try {
            console.log('Sending initial response.');
            await interaction.reply({ content: 'Processing your request...', ephemeral: true });

            console.log('Fetching messages.');
            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

            const messagesToDelete = sortedMessages.filter((msg, index) => {
                const msgDate = new Date(msg.createdTimestamp);
                return index >= 2 && msgDate >= start && msgDate <= end;
            });

            console.log(`Found ${messagesToDelete.size} messages to delete.`);
            for (const msg of messagesToDelete.values()) {
                try {
                    await msg.delete();
                    console.log(`Deleted message: ${msg.id}`);
                } catch (deleteError) {
                    console.error('Error deleting message:', deleteError);
                }
            }

            const sessionEndEmbed = new EmbedBuilder()
                .setTitle('Snowville | Session Over')
                .setDescription(`Thank you for joining the Snowville roleplay session. We as the community are looking forward to seeing you!

                **__Session Details:__**
                Host: **<@${interaction.user.id}>**
                Start Time: **${startTime}**
                End Time: **${endTime}**`)
                .setImage("https://cdn.discordapp.com/attachments/1284485057058439168/1284854422547071071/Snowville_4.png?ex=66e8256d&is=66e6d3ed&hm=1e6c6dcfdac6543d6cb2385b7a9f252fee535268fcd2649511d8267bb4af280a&")
                .setColor(`#f3ca9a`)
                .setFooter({
                    text: 'Snowville',
                    iconURL: 'https://cdn.discordapp.com/attachments/1284485057058439168/1284788237944098866/image.png?ex=66e7e7ca&is=66e6964a&hm=874b1fcc1f468acee240ec19f361cb474f6b31913e309d36a00365efcb6bb084&'
                });

            console.log('Sending session end embed.');
            await interaction.channel.send({ embeds: [sessionEndEmbed] });

            // Send a notification embed to the specific channel
            const notificationEmbed = new EmbedBuilder()
                .setTitle('Session Ended')
                .setDescription(`**<@${interaction.user.id}>** has ended their roleplay session.
                    Start Time:${startTime}
                    End Time:${endTime}**
                    
                    Command used in: <#${interaction.channel.id}>`)
                .setColor(`#f3ca9a`)
                .setFooter({
                    text: 'Snowville',
                    iconURL: 'https://cdn.discordapp.com/attachments/1284485057058439168/1284788237944098866/image.png?ex=66e7e7ca&is=66e6964a&hm=874b1fcc1f468acee240ec19f361cb474f6b31913e309d36a00365efcb6bb084&'
                });

            console.log('Sending session end notification.');
            const notificationChannel = await interaction.client.channels.fetch('1284792138177187843');
            if (notificationChannel) {
                await notificationChannel.send({ embeds: [notificationEmbed] });
            } else {
                console.error('Notification channel not found.');
            }

            // Edit the initial response to indicate completion
            console.log('Editing reply to indicate success.');
            await interaction.editReply({ content: 'Command processed successfully.', ephemeral: true });
        } catch (error) {
            console.error('Error handling command:', error);
            try {
                if (!interaction.replied) {
                    await interaction.reply({ content: 'Failed to process the command. Please try again later.', ephemeral: true });
                } else {
                    await interaction.followUp({ content: 'Failed to process the command. Please try again later.', ephemeral: true });
                }
            } catch (replyError) {
                console.error('Error sending error reply:', replyError);
            }
        }
    },
};
