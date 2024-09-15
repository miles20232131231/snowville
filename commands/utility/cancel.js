const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cancel')
        .setDescription('Sends a cancel embed embed')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>  // Change to String for reasons
            option.setName('reason')
                .setDescription('The reason for cancelling the session')
                .setRequired(true)),
    async execute(interaction) {
        const reason = interaction.options.getString('reason'); // Changed to 'reason' here
        const user = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle('Session Cancellation Notice')
            .setDescription(`Dear Members,

We regret to inform you that <@${user.id}> has decided to cancel their session. We, the Snowville staff team, sincerely apologize for any inconvenience this may cause.

**Reason for Cancellation:** ${reason}

We appreciate your understanding and patience in this matter. Should you have any further questions or concerns, please feel free to reach out to us. We look forward to seeing you in future sessions.

Warm regards,
The Snowville Staff Team`)
            .setImage("https://cdn.discordapp.com/attachments/1284485057058439168/1284854422865842209/Snowville_5.png?ex=66e8256d&is=66e6d3ed&hm=646f5d2b541e69b07a2d0a78188eec6eed7c864d392afa8ac4ac840501666071&")
            .setColor(`#f3ca9a`)
            .setFooter({
                text: 'Snowville',
                iconURL: 'https://cdn.discordapp.com/attachments/1284485057058439168/1284788237944098866/image.png?ex=66e7e7ca&is=66e6964a&hm=874b1fcc1f468acee240ec19f361cb474f6b31913e309d36a00365efcb6bb084&'
            });

        const message = await interaction.channel.send({
            embeds: [embed]
        });

        await message.react('😭');

        const newEmbed = new EmbedBuilder()
            .setTitle("Session Cancellation")
            .setDescription(`<@${user.id}> has canceled their session in <#${interaction.channel.id}>.
                **Reason:** ${reason}`)
            .setColor(`#f3ca9a`)
            .setFooter({
                text: 'Snowville',
                iconURL: 'https://cdn.discordapp.com/attachments/1284485057058439168/1284788237944098866/image.png?ex=66e7e7ca&is=66e6964a&hm=874b1fcc1f468acee240ec19f361cb474f6b31913e309d36a00365efcb6bb084&'
            });

        const targetChannel = await interaction.client.channels.fetch('1284792138177187843');
        await targetChannel.send({ embeds: [newEmbed] });

        await interaction.reply({ content: `The session has been canceled successfully.`, ephemeral: true });
    },
};
