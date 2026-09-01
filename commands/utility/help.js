const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const dicehelpEmbed = new EmbedBuilder().setTitle("このBotについて").setColor(0x336699);

module.exports = {
	data: new SlashCommandBuilder().setName("help").setDescription("ヘルプを表示します"),

	async execute(interaction) {
		dicehelpEmbed
			.setDescription("BCDiceを利用したDiscord用のダイスボットです")
			.addFields(
				{ name: "/dice", value: "ダイスを振ることができます", inline: true },
				{ name: "/d", value: "\*\*/dice\*\*の短縮版です", inline: true },
				{ name: "", value: "", inline: false },
				{ name: "/setdice", value: "ダイスの種類を変更します", inline: true },
				{ name: "/info", value: "ダイスの詳細を表示します", inline: true },
			);
		await interaction.reply({
			embeds: [dicehelpEmbed],
			allowedMentions: { repliedUser: false },
			flags: "SuppressNotifications",
		});
	},
};
