require("dotenv").config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const wait = require("node:timers/promises").setTimeout;

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const phrases = [
  "Here's your picture!",
  "Thanks for waiting!",
  "Here you go!",
  "This is for you!",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("draw")
    .setDescription("Creates an artificially generated image")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Description for the image")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    await wait(7000);

    let prompt = interaction.options.getString("prompt");

    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    //uploads images to specific album in imgur
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${process.env.ACCESS_TOKEN}`);

    var formdata = new FormData();
    formdata.append("image", `${response.data.data[0].url}`);
    formdata.append("type", "URL");
    formdata.append("album", "K59ulz6");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    //returns imgur image link of the AI art
    async function fetchText(url, requestOptions) {
      let response = await fetch(url, requestOptions);
      let result = await response.json();
      return result.data.link;
    }

    let imgurImageLink = await fetchText(
      "https://api.imgur.com/3/image",
      requestOptions
    );

    const random = Math.floor(Math.random() * phrases.length);

    //displays the AI art based on the prompt
    const imageEmbed = new EmbedBuilder()
      .setURL("https://openai.com/")
      .setTitle(`${phrases[random]}`)
      .setDescription(`${prompt}`)
      .setColor(0x1abc9c)
      .setImage(imgurImageLink)
      .setFooter({
        text: "Generated with DALL-E API",
        iconURL: "https://i.imgur.com/vHOt03p.png",
      });

    await interaction.editReply({
      embeds: [imageEmbed],
    });
  },
};
