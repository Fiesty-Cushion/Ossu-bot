const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();
client.commandArray = [];
client.chatbot = require("./chatbot");

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of functionFiles) {
    require(`./functions/${folder}/${file}`)(client);
  }
}

const botChannel = "970194185682575411";

client.on("messageCreate", (message) => {
  if (message.channelId == botChannel && !message.content.startsWith("!")) {
    if (message.author.bot) return;
    if (message.guild) {
      client.chatbot.talkBack(message);
    }
  }
});

client.handleEvents();
client.handleCommands();
client.login(process.env.BOT_TOKEN);
