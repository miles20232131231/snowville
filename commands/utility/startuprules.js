const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup-message')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Gives Startup msg'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const image = "https://cdn.discordapp.com/attachments/1284485057058439168/1284854018597851216/Snowville_1.png?ex=66e8250d&is=66e6d38d&hm=0bd7bb58494c0a5b6d67d9c66b9db1fd6568eafe352fc1b9ef373dcb1cbd0266&";

        const embed1 = new EmbedBuilder()
            .setTitle('Snowville | Server Startup')
            .setDescription("> Hello, Welcome to <#1284792109819236425>.We are excited to have you participate in our roleplay sessions. To ensure a smooth experience for everyone, please take note of the following guidelines:")
            .setThumbnail("https://cdn.discordapp.com/attachments/1284485057058439168/1284788237944098866/image.png?ex=66e7e7ca&is=66e6964a&hm=874b1fcc1f468acee240ec19f361cb474f6b31913e309d36a00365efcb6bb084&")
            .setColor(`#f3ca9a`);

        const embed2 = new EmbedBuilder()
            .setTitle('Startup Information')
            .setDescription(`Session Notifications: All session notifications will be posted in this channel. You will be alerted when a new session begins, so there is no need to request session times or re-invites. We aim to keep everyone informed promptly and efficiently.

Role Management: To avoid disrupting the flow of our sessions, please do not inquire about session times or ask for re-invites. Instead, use the Session Ping button to receive notifications about session starts. This role will ensure you are automatically pinged with updates. Repeated requests or disruptions may result in a mute to maintain the quality of our roleplay environment.

Respect and Conduct: We ask for your cooperation in maintaining a respectful atmosphere. Please refrain from spamming or engaging in off-topic discussions in this channel. Your adherence to these guidelines helps create a positive experience for all participants.`)
.setColor(`#f3ca9a`);


        
        // Keep only the 'Session Ping' button
        const button1 = new ButtonBuilder()
            .setCustomId('toggle_ping')
            .setLabel('Session Ping')
            .setStyle(ButtonStyle.Primary);

        // Create the action row with only the 'Session Ping' button
        const row = new ActionRowBuilder()
            .addComponents(button1);

        await interaction.channel.send({ files: [image], embeds: [embed1, embed2], components: [row] });

        await interaction.editReply({ content: 'Startup message sent.' });
    },
};
