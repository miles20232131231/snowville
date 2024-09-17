const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Sends a startup embed')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
                .setRequired(true)),
    async execute(interaction) {
        const reactions = interaction.options.getInteger('reactions');
        const user = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle('Snowville | Session Startup')
            .setDescription(`<@${interaction.user.id}> is initiating a roleplay session. Please ensure you have reviewed the server information available in <#1284792095034572912>.

Before participating, make sure your vehicle is properly registered. To register your vehicle, use the /register command in <#1284792115670417453>.

This session will commence once this message receives ${reactions} or more reactions.`)
            .setImage("https://cdn.discordapp.com/attachments/1284485057058439168/1284854018597851216/Snowville_1.png?ex=66e8250d&is=66e6d38d&hm=0bd7bb58494c0a5b6d67d9c66b9db1fd6568eafe352fc1b9ef373dcb1cbd0266&")
            .setColor(`#f3ca9a`)
            .setFooter({
                text: 'Snowville',
                iconURL: 'https://cdn.discordapp.com/attachments/1284485057058439168/1284788237944098866/image.png?ex=66e7e7ca&is=66e6964a&hm=874b1fcc1f468acee240ec19f361cb474f6b31913e309d36a00365efcb6bb084&'
            });

        // Create the "Banned Vehicle List" button (Primary)
        const bannedVehicleButton = new ButtonBuilder()
            .setCustomId('bannedVehicleList')
            .setLabel('Banned Vehicle List')
            .setStyle(ButtonStyle.Primary);

        // Create action row to hold the button
        const row = new ActionRowBuilder()
            .addComponents(bannedVehicleButton);

        const message = await interaction.channel.send({
            content: '@everyone',
            embeds: [embed],
            components: [row]  // Add the primary button to the message
        });

        await message.react('✅');

        // Handle reactions and session startup
        const reactionFilter = (reaction, user) => reaction.emoji.name === '✅';
        const reactionCollector = message.createReactionCollector({ filter: reactionFilter, time: 86400000 });

        reactionCollector.on('collect', (reaction) => {
            console.log(`Collected ${reaction.count} reactions`);
            if (reaction.count >= reactions) {
                const settingUpEmbed = new EmbedBuilder()
                    .setDescription('Setting up!');

                interaction.channel.send({ embeds: [settingUpEmbed] });
                reactionCollector.stop();
            }
        });

        reactionCollector.on('end', collected => {
            console.log(`Collector ended. Total reactions: ${collected.size}`);
        });

        await interaction.reply({ content: `You have initiated a session successfully.`, ephemeral: true });
    },
};

// Handle button interactions separately
module.exports.handleInteraction = async (interaction) => {
    if (interaction.isButton() && interaction.customId === 'bannedVehicleList') {
        // Send the Google Docs link when the button is clicked
        await interaction.reply({
            content: 'https://docs.google.com/document/d/1hNoYMil7oEzHnIwUxXbAmop43zf8aoWQuA8T8WKQFlQ/edit?usp=sharing',
            ephemeral: true  // Only the user who clicked the button will see this message
        });
    }
};
