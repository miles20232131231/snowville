const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staffinfo')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Staff Information embeed'),
    async execute(interaction) {

        const embed1 = new EmbedBuilder()
            .setTitle('Snowville Staff Rules and Roleplay Guidelines')
            .setDescription(`1. **Professionalism:** Maintain a high level of professionalism at all times. This includes being respectful, courteous, and helpful to all members.
   
2. **Confidentiality:** Do not disclose sensitive information or private conversations outside of the staff team. Respect the privacy of all members.
   
3. **Impartiality:** Treat all members equally and without favoritism. Make decisions based on the rules and facts, not personal feelings or relationships.
   
4. **Communication:** Use clear and respectful language in all forms of communication. Ensure that instructions and feedback are conveyed constructively.
   
5. **Activity:** Stay active and engaged. Regularly check in and participate in staff meetings and discussions to stay updated on community matters.

6. **Disputes:** Resolve conflicts and disagreements with other staff members professionally and privately. If necessary, escalate the issue to a higher authority within the staff team.

7. **Accountability:** Be responsible for your actions and decisions. If a mistake is made, acknowledge it and work to correct it promptly.

#### **2. Roleplay Guidelines**

1. **Adherence to Rules:** Follow the established roleplay rules and guidelines at all times. Ensure that you are familiar with and up-to-date on the community's roleplay policies.

2. **Roleplay Integrity:** Stay in character during roleplay sessions and avoid breaking character unless it’s necessary for the advancement of the scenario or to address a specific issue.

3. **Respect for Others:** Respect the roleplay choices and actions of other members. Avoid actions or decisions that could disrupt or negatively impact their experience.

4. **Fair Play:** Ensure that all roleplay scenarios are fair and balanced. Avoid any actions that would give you or others an unfair advantage in the roleplay setting.

5. **Scenario Management:** Manage roleplay scenarios effectively by guiding the story and ensuring that all participants are engaged and enjoying the experience.

6. **Conflict Resolution:** Address any in-character conflicts or issues with other members in a constructive manner. If a dispute arises that cannot be resolved in-character, seek assistance from other staff members.

7. **Feedback:** Provide constructive feedback to other roleplayers and staff members to help improve the roleplay experience for everyone. Be open to receiving feedback as well.

8. **Rule Enforcement:** Enforce roleplay rules consistently and fairly. Address any violations or rule-breaking promptly and in accordance with community policies.

#### **3. Staff Meetings and Training**

1. **Participation:** Attend all scheduled staff meetings and training sessions. These are crucial for maintaining consistency and keeping updated on community changes.

2. **Training:** Participate in any additional training or development opportunities to enhance your skills and knowledge in managing and facilitating roleplay.

3. **Reporting:** Report any issues or concerns discussed in meetings or training to the appropriate channels. Ensure that all relevant information is communicated clearly and promptly.

#### **4. Staff Behavior in Public Channels**

1. **Visibility:** Maintain a professional demeanor in all public channels and interactions. Your behavior reflects the standards of the Snowville staff team.

2. **Support:** Provide assistance and support to members in public channels as needed. Ensure that all interactions are helpful and in line with community standards.

3. **Moderation:** Actively moderate public channels to enforce community rules and guidelines. Address any rule violations or inappropriate behavior swiftly and appropriately.`)
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
