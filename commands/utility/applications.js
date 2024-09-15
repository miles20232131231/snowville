const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('application')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('application embed'),
    async execute(interaction) {

        const embed2 = new EmbedBuilder()
            .setTitle('Server Applications')
            .setDescription(`Thank you for your interest in becoming a part of our vibrant community. This section is dedicated to all official applications related to Snowville. Please be advised that all applications are conducted through Google Forms to ensure a smooth and efficient process.

Our applications are carefully reviewed by either the Human Resources (HR) team or the designated Department Overseer, depending on the nature of the role. We take great care in thoroughly evaluating each submission to maintain the quality and integrity of our community.

If you have any questions or require assistance during the application process, please don't hesitate to reach out to our team.


**No applications at the moment**`)
.setThumbnail("https://cdn.discordapp.com/attachments/1284485057058439168/1284788237944098866/image.png?ex=66e7e7ca&is=66e6964a&hm=874b1fcc1f468acee240ec19f361cb474f6b31913e309d36a00365efcb6bb084&")
            .setColor(`#f3ca9a`);

        await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });

        async function sendEmbedMessages() {
            await interaction.channel.send({ embeds: [embed2] });
        }

        try {
            await sendEmbedMessages();
        } catch (error) {
            console.error('Error sending embed messages:', error);
        }
    },
};
