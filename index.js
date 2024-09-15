require("dotenv").config();
const { token } = process.env;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});

client.commands = new Collection();
client.commandArray = [];

// Handle events
const handleEvents = async () => {
    const eventFiles = fs.readdirSync(`./events`).filter((file) => file.endsWith(".js"));
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
        else client.on(event.name, (...args) => event.execute(...args, client));
    }
};

// Handle commands
const handleCommands = async () => {
    const commandFolders = fs.readdirSync(`./commands`);
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            try {
                const command = require(`./commands/${folder}/${file}`);
                if (!command || !command.data || !command.data.name || !command.execute) {
                    console.warn(`Command file ${file} is missing required properties.`);
                    continue;
                }
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            } catch (error) {
                console.error(`Error loading command ${file}:`, error);
            }
        }
    }

    const clientId = "1284793516530208821";
    const guildId = "1284787684644093992";
    const rest = new REST({ version: "9" }).setToken(token);

    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: client.commandArray,
        });
        console.log("Slash commands uploaded");
    } catch (error) {
        console.error("Error uploading commands:", error);
    }
};

client.handleEvents = handleEvents;
client.handleCommands = handleCommands;

(async () => {
    await client.handleEvents();
    await client.handleCommands();
})();

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

client.login(token);
