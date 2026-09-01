const { SlashCommandBuilder } = require("discord.js");
const Database = require("better-sqlite3");
const { translateSystemName } = require("../helper/translate_system_name");

const db = new Database("./db/setting.db", { verbose: console.log });
db.pragma("journal_mode = WAL");

const getUser = db.prepare(`SELECT * FROM DiceSystem WHERE user_id = ?`);
const insertDiceSystem = db.prepare(`INSERT INTO DiceSystem (user_id, system) VALUES (?, ?);`);
const updateDiceSystem = db.prepare(`UPDATE DiceSystem SET system = ? WHERE user_id = ?;`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setdice")
		.setDescription("ダイスの種類を変更します")
		.addStringOption((option) =>
			option
				.setName("system")
				.setDescription("使用するダイスシステムを指定します")
				.setRequired(true)
				.addChoices(
					{ name: "通常ダイス", value: "DiceBot" },
					{ name: "CoC6版", value: "Cthulhu" },
					{ name: "CoC7版", value: "Cthulhu7th" },
					{ name: "シノビガミ", value: "ShinobiGami" },
					{ name: "ダブルクロス3rd", value: "DoubleCross" },
					{ name: "エモクロア", value: "Emoklore" },
					{ name: "虚構侵蝕", value: "KyokoShinshoku" },
					{ name: "ソード・ワールド2.5", value: "SwordWorld2.5" },
					{ name: "nRR", value: "NRR" },
				),
		),

	async execute(interaction) {
		const system = interaction.options.getString("system");
		const user_id = interaction.user.id;
		const user = getUser.get(user_id);
		if (user) {
			updateDiceSystem.run(system, user_id);
		} else {
			insertDiceSystem.run(user_id, system);
		}
		await interaction.reply({
			content: `使用するダイスを \`${await translateSystemName(system)}\` に設定しました`,
			allowedMentions: { repliedUser: false },
			flags: "Ephemeral",
			// flags: 'SuppressNotifications'
		});
	},
};
