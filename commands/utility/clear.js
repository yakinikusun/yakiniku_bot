const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync("./db/setting.db");

module.exports = {
	data: new SlashCommandBuilder().setName("clear").setDescription("DBを初期化します"),

	async execute(interaction) {
		if (!interaction.inGuild()) {
			await interaction.reply({
				content: "DMではこのコマンドを実行できません",
				allowedMentions: { repliedUser: false },
				flags: "Ephemeral",
			});
			return;
		}

		if (
			interaction.guild.id !== process.env.ADMINGUILDID ||
			!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
		) {
			await interaction.reply({
				content: "このコマンドを実行するには管理者権限が必要です",
				allowedMentions: { repliedUser: false },
				flags: "Ephemeral",
			});
			return;
		}

		const clearDB = db.prepare(`DELETE FROM DiceSystem;`);
		clearDB.run();

		await interaction.reply({
			content: "DBを初期化しました",
			allowedMentions: { repliedUser: false },
			flags: "Ephemeral",
		});
	},
};
