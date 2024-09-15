const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-shop')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Gives Server shop embed.'),
    async execute(interaction) {

        const embed1 = new EmbedBuilder()
            .setTitle('Shop Inforation')
            .setDescription(`Explore the amazing perks and features available to our community! For detailed information on all perks and prices, please refer to the designated channels. Some perks may require you to create a ticket or reach out to specific staff members before finalizing your purchase.

Please note that prices and perks are subject to change with advance notice. We are constantly working to enhance your experience with new features and updates. Be sure to check out our exclusive boosting perks in the available options below.

Thank you for being a part of Snowville, and enjoy all that we have to offer!


Banned Vehicle Permissions
**Price:** 150 Robux
Gain access to exclusive banned vehicles for your roleplaying needs.

Early Access (EA)
**Price:** 100 Robux
Get early access to new features, updates, and content before anyone else.

Ultra Banned Vehicle Permissions
**Price:** 200 Robux
Obtain access to an even more exclusive list of banned vehicles.

Paid Partners
**Price:** 300 Robux
Enjoy benefits and perks as a recognized paid partner within the community.

Image Permissons
**Price:** 50 robux
Enjoy being able to send images and GIFs in any channel you want.

Sponsored Giveaway
**Price:** 400 Robux
Get your giveaway in our server.


**1-3 Booster Perks**
                    <@&1284792069470158910>
                    <@&1284792066466906206>
                    <@&1284823743222386698>
                    25K eco per week
                    New Vehicle Registration Limit: 6
                    
                    **4+ Booster Perks**
                    100K per week
                    New Vehicle Registration Limit: 10`)
.setThumbnail("https://cdn.discordapp.com/attachments/1284485057058439168/1284788237944098866/image.png?ex=66e7e7ca&is=66e6964a&hm=874b1fcc1f468acee240ec19f361cb474f6b31913e309d36a00365efcb6bb084&")
.setColor(`#f3ca9a`);
        

        await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });

        async function sendEmbedMessages() {
            await interaction.channel.send({ embeds: [embed1] });
        }

        try {
            await sendEmbedMessages();
        } catch (error) {
            console.error('Error sending embed messages:', error);
        }
    },
};
