const { SlashCommandBuilder, EmbedBuilder, Guild } = require("discord.js");

const { Days } = require("../../../routine.json");

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("routine")
    .setDescription("Provides Daily Routine")
    .addStringOption((option) =>
      option
        .setName("day")
        .setDescription("Routine for Provided Day")
        .addChoices(
          { name: "Sunday", value: "Sunday" },
          { name: "Monday", value: "Monday" },
          { name: "Tuesday", value: "Tuesday" },
          { name: "Wednesday", value: "Wednesday" },
          { name: "Thursday", value: "Thursday" },
          { name: "Friday", value: "Friday" }
        )
    ),

  async execute(interaction, client) {
    var day = interaction.options.getString("day");

    //in case user doesn't specify day from options, assign present day
    if (!day) {
      let dayIndex = new Date().getDay();
      const hours = new Date().getHours();

      //sends next day's routine after 12PM for each day except Friday and Saturday
      //from Friday after 12PM and all Saturday, sends Sunday's routine
      if (hours <= 12 && dayIndex != 6) {
        day = weekDays[dayIndex];
      } else if (hours > 12 && (dayIndex == 6 || dayIndex == 5)) {
        day = weekDays[0];
      } else {
        day = weekDays[dayIndex + 1];
      }
    }

    //to iterate through object
    let periods = Object.keys(Days[day]);
    let routine = [];

    //creates an array of objects containing routine info
    periods.forEach(function (period) {
      let PeriodInfo = {
        name: `${period} Period - ${Days[day][period].subject}`,
        value: `${Days[day][period].teacher}\n${Days[day][period].time}`,
      };
      routine.push(PeriodInfo);
    });

    //creates the embed for routine
    const embedRoutine = new EmbedBuilder()
      .setTitle(`**${day}'s Routine**`)
      .setColor(0x1abc9c)
      .addFields(routine)
      .setTimestamp()
      .setFooter(
        {text: client.user.tag }
      );

    await interaction.reply({
      embeds: [embedRoutine],
    });
  },
};
