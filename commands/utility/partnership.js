const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alliances')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('alliances embed'),
    async execute(interaction) {

        const embed2 = new EmbedBuilder()
            .setTitle('Server alliances')
            .setDescription(`At Snowville, we value collaborative partnerships with like-minded communities to foster mutual growth and engagement. If you're interested in forming a partnership with us, you can submit your request in the <#1284792105427795979> channel.

Please note that all communities must meet our partnership criteria. If your community does not meet the necessary requirements, you may still explore the option of a paid partnership. Full details regarding this option can be found in the <#1284792095034572912> channel.

Partnership Requirements:

Community Size:
200 members: No ping will be allowed within Snowville, but you are required to use an @everyone ping for us.
250-600 members: You will be allowed an @here ping within Snowville, and you must use an @everyone ping for us.
600+ members: Both communities will use an @everyone ping to maximize visibility.
Platform Relevance:
Your community must be based on one of the following platforms:

Greenville, Wisconsin
Southwest, Florida
Jupiter, Florida
If you have any further questions or need clarification, feel free to reach out to our team via the #assistance channel. We're excited about the possibility of partnering with you!

`)
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
