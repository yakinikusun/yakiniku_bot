const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const dicehelpEmbed = new EmbedBuilder().setTitle("このBotについて").setColor(0x336699);

module.exports = {
	data: new SlashCommandBuilder().setName("help").setDescription("ヘルプを表示します"),

	async execute(interaction) {
		dicehelpEmbed
			.setDescription("カス機能が沢山入ってるボットです")
			.setFields(
				{ name: "鳥検知", value: "以下のものを送信した場合、鳥扱いします\n『うぉ\*, うお, うおっ, うおw, うおW, おお, おぉ』", inline: false },)
			.addFields(
				{ name: "自動冷笑", value: "1/100の確率で冷笑します\n1/10000の確率で特大冷笑します", inline: false },)
			.addFields(
				{ name: "コマンド一覧", value: "", inline: false },)
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
