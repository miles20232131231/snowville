const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-information')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Provides information about the server.'),
    async execute(interaction) {
        const embed1 = new EmbedBuilder()
            .setTitle('Server Information')
            .setDescription('Welcome to Snowville! Here you can get information about the server. For more information, visit <#1284792105427795979>')
            .setThumbnail("https://cdn.discordapp.com/attachments/1284485057058439168/1284788237944098866/image.png?ex=66e7e7ca&is=66e6964a&hm=874b1fcc1f468acee240ec19f361cb474f6b31913e309d36a00365efcb6bb084&")
            .setColor('#f3ca9a');

        const embed2 = new EmbedBuilder()
            .setTitle('Server Regulations')
            .setDescription(`1. Be Respectful
Treat all members with kindness and respect. No harassment, bullying, or hate speech will be tolerated. Everyone is here to have fun!

2. Keep Content Safe for Work (SFW)
All chat, images, and content shared within this server must be appropriate for all ages. No NSFW, inappropriate, or offensive content.

3. No Spamming
Avoid spamming in any channels, whether it's through messages, emojis, links, or images. Keep the chat clean and readable for everyone.

4. Use Channels Appropriately
Each channel has a specific purpose. Make sure you're using the right channel for the right activity (e.g., roleplay in roleplay channels, memes in meme channels).

5. Follow Roleplay Guidelines
Realistic Roleplay Only: This is a realistic roleplay server. All roleplays should reflect real-life scenarios.
No Fail Roleplay: Don’t engage in unrealistic or non-serious roleplay actions (e.g., driving off a cliff for fun).
No Meta-Gaming or Power-Gaming: Don’t use out-of-character knowledge in-character. Don’t force actions on other players without consent.
Roleplay Cooldown: Give others a chance to roleplay properly and take turns in scenes. Don't hog the attention.

6. No Advertising or Self-Promotion
Advertising of any kind, whether for other Discord servers or personal content, is not allowed without staff approval.

7. Obey Staff Members
Staff members are here to help maintain the server. Please follow their instructions at all times. If you have an issue with a staff member, raise it privately with another member of the team.

8. Vehicle Regulations
Only use vehicles that are listed as approved for roleplay.
No Banned Vehicles: The banned vehicle list must be strictly followed.
No unrealistic modifications, speeds, or behavior with vehicles.

9. Respect the Server’s Roleplay Structure
No Random Deathmatch (RDM): You may not randomly attack or kill other players without proper roleplay initiation.
No Vehicle Deathmatch (VDM): Don't use vehicles to attack other players in a non-roleplay situation.

10. Ticketing and Strikes
If you break the rules, you may receive tickets or strikes based on the severity of the offense. Three strikes may result in a ban from the server.

11. No Impersonation
Do not impersonate other members, staff, or any official entities. This includes using similar usernames, avatars, or claiming authority you don’t have.

12. No Exploiting or Glitching
Do not use any cheats, exploits, or bugs in-game to gain an advantage or disrupt others' gameplay.

13. Reporting Issues
If you witness any rule-breaking or issues, report it to the staff through the appropriate ticket system or report channel.

14. Roleplay Respectfully
All members should contribute to an immersive and enjoyable roleplay experience. Disruptive or disrespectful behavior during roleplays will not be tolerated.`)
            .setColor('#f3ca9a');

            const embed3 = new EmbedBuilder()
            .setTitle('Roleplay Information')
            .setDescription(`1.General Conduct
Be respectful to all members. No harassment, discrimination, or bullying.
Keep conversations appropriate for all ages. No excessive swearing or NSFW content.
Avoid drama and arguments. Keep the server positive.

2. Roleplay Etiquette
Roleplay should be realistic and respectful to others' characters.
No metagaming or using OOC knowledge in IC scenarios.

3. In-Game Rules
Follow traffic laws and roleplay realistically. No random or intentional killing (RDM/VDM).
In accidents, roleplay the situation properly.

4. Use of Vehicles
Use appropriate vehicles and avoid excessive customizations.
Check the banned vehicle list regularly.

5. Session Rules
Follow staff instructions and don’t interrupt ongoing roleplays.
Respect the seriousness of strict RP sessions.

6. Use of Discord
Use channels appropriately and avoid spamming.
Be respectful in voice chats and stick to RP guidelines.

7. Staff and Administration
Respect staff decisions and report issues through proper channels.
Don’t engage directly with rulebreakers.

8. Punishments
Warnings for minor offenses, bans for serious or repeated violations.
Use the appeal process for disputes.

9. Event Participation
Follow event rules and assigned roles during special events.

10. Miscellaneous
Keep roleplay creative but realistic.
English is the primary language, and no cheating or exploiting is allowed.`)
            .setColor('#f3ca9a');


        try {
            await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });
            await interaction.channel.send({ embeds: [embed1, embed2, embed3] });
        } catch (error) {
            console.error('Error sending embed messages:', error);
            await interaction.reply({ content: 'There was an error sending the information.', ephemeral: true });
        }
    },
};
