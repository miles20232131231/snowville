const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('early')
        .setDescription('Sends the early access embed.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that EA people can join.')
                .setRequired(true)),
    async execute(interaction) {
        const sessionLink = interaction.options.getString('session-link');

        const embed = new EmbedBuilder()
            .setTitle('Snowville | Early Access')
            .setDescription('Early Access is now Live! Nitro Boosters, members of the Emergency Services, and Content Creators can join the session by clicking the button below.\n\nPlease keep in mind that sharing the session link with anyone is strictly forbidden and may lead to penalties. We appreciate your cooperation in keeping our community secure and fair for everyone.')
            .setImage("https://cdn.discordapp.com/attachments/1284485057058439168/1284854421804683356/Snowville_2.png?ex=66e8256d&is=66e6d3ed&hm=88e9d315c1b834afec8a235ec4ea9cf84fd8830269b25c12c55b9ed6e42c41ca&")
            .setColor(`#f3ca9a`)
            .setFooter({
                text: 'Snowville',
                iconURL: 'https://cdn.discordapp.com/attachments/1284485057058439168/1284788237944098866/image.png?ex=66e7e7ca&is=66e6964a&hm=874b1fcc1f468acee240ec19f361cb474f6b31913e309d36a00365efcb6bb084&'
            });
        const button = new ButtonBuilder()
            .setLabel('Early Access')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('ea');

        const row = new ActionRowBuilder()
            .addComponents(button);

            const newEmbed = new EmbedBuilder()
            .setTitle("Session Early Access")
            .setDescription(`<@${interaction.user.id}> released early access. The link is provided below
                **Link**
                ${sessionLink}
                
                Command used in <#${interaction.channel.id}>`)

        const targetChannel = await interaction.client.channels.fetch('1284792138177187843');
        await targetChannel.send({ embeds: [newEmbed] });


        await interaction.channel.send({ 
            content: '<@&1284792062264213526>, <@&1284823743222386698>, <@&1284843034118455412>', 
            embeds: [embed], 
            components: [row] 
        });

        await interaction.reply({ content: 'Early Access Sent.', ephemeral: true });

        const filter = i => i.customId === 'ea';
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 9999999 });

        collector.on('collect', async i => {
            const logChannel = interaction.guild.channels.cache.get('1284792138177187843');
            if (logChannel) {
                await logChannel.send(`Interaction collected from ${i.user.tag} at ${new Date().toISOString()}`);
            }

            if (i.member.roles.cache.has('1284843034118455412') || i.member.roles.cache.has('1284792062264213526') || i.member.roles.cache.has('1284823743222386698') || i.member.roles.cache.has('1284792052529496104') || i.member.roles.cache.has('1284792055066923018') || i.member.roles.cache.has('1284792059269484604') || i.member.roles.cache.has('1284792046074331136')) {
                await i.reply({ content: `**Link:** ${sessionLink}`, ephemeral: true });
            } else {
                await i.reply({ 
                    content: 'You do not have permission to use this button.',   
                    ephemeral: true 
                });
            }
        });

        collector.on('end', async collected => {
            const logChannel = interaction.guild.channels.cache.get('1284792138177187843');
            if (logChannel) {
                await logChannel.send(`Collected ${collected.size} interactions.`);
            }
        });

        collector.on('error', async error => {
            const logChannel = interaction.guild.channels.cache.get('1284792138177187843');
            if (logChannel) {
                await logChannel.send(`Collector encountered an error: ${error}`);
            }
            console.error('Collector encountered an error:', error);
        });
    },
};
