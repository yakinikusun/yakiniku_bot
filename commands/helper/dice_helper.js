const { DatabaseSync } = require('node:sqlite');
const { DynamicLoader } = require("bcdice");
const { translateSystemName } = require("./translate_system_name");

const db = new DatabaseSync("./db/setting.db");
const getUser = db.prepare(`SELECT * FROM DiceSystem WHERE user_id = ?`);
getUser.setReadBigInts(true);

async function diceroll(system, roll) {
	const loader = new DynamicLoader();
	const GameSystem = await loader.dynamicLoad(system);
	const result = GameSystem.eval(roll);
	return result;
}

async function executeDice(interaction, user_id, roll) {
	const user = getUser.get(user_id);
	const system = user ? user.system : "DiceBot";
	var rollResult = await diceroll(system, roll);
	try {
		if (rollResult.secret) {
			await interaction.reply({
				content:
					">>> " + roll.replace(/\*/g, "\\*") + "\n> ⇒ " + rollResult.text.replace(/\*/g, "\\*"),
				allowedMentions: { repliedUser: false },
				flags: "Ephemeral",
			});
		} else {
			await interaction.reply({
				content:
					">>> " + roll.replace(/\*/g, "\\*") + "\n⇒ " + rollResult.text.replace(/\*/g, "\\*"),
				allowedMentions: { repliedUser: false },
				flags: "SuppressNotifications",
			});
		}
	} catch {
		await interaction.reply({
			content: "入力に誤りがあります\n現在のダイス: `" + (await translateSystemName(system)) + "`",
			allowedMentions: { repliedUser: false },
			flags: "Ephemeral",
		});
	}
}

module.exports = {
	executeDice,
};
