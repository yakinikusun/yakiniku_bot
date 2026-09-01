const { DynamicLoader } = require("bcdice");
const { SlashCommandBuilder, MessageFlags, ContainerBuilder } = require("discord.js");
const Database = require("better-sqlite3");
const { translateSystemName } = require("../helper/translate_system_name");

const db = new Database("./db/setting.db");
const getUser = db.prepare(`SELECT * FROM DiceSystem WHERE user_id = ?`);

module.exports = {
	data: new SlashCommandBuilder().setName("info").setDescription("ダイスの詳細を表示します"),

	async execute(interaction) {
		const user = getUser.get(interaction.user.id);
		const system = user ? user.system : "DiceBot";
		const loader = new DynamicLoader();
		const GameSystem = await loader.dynamicLoad(system);
		const helpText = GameSystem.HELP_MESSAGE;
		let Component = new ContainerBuilder().setAccentColor(0x336699);
		if (system !== "DiceBot") {
			const systemName = await translateSystemName(system);
			Component.addTextDisplayComponents((textDisplay) =>
				textDisplay.setContent(
					`### ${systemName} ダイス説明\n>>> ${helpText.replace(/\*/g, "\\*")}`,
				),
			).addTextDisplayComponents((textDisplay) =>
				textDisplay.setContent(
					`共通ダイスの詳細は下記URLのコマンドガイドを参照\nhttps://docs.bcdice.org/`,
				),
			);
		} else {
			Component.addTextDisplayComponents((textDisplay) =>
				textDisplay.setContent(
					`### 共通ダイス\n>>> ${helpText.replace("詳細は下記URLのコマンドガイドを参照\nhttps://docs.bcdice.org/\n", "").replace(/^(.+)/gm, `- $1`)}`,
				),
			).addTextDisplayComponents((textDisplay) =>
				textDisplay.setContent(`詳細は下記URLのコマンドガイドを参照\nhttps://docs.bcdice.org/`),
			);
		}
		await interaction.reply({
			components: [Component],
			allowedMentions: { repliedUser: false },
			flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
		});
	},
};
