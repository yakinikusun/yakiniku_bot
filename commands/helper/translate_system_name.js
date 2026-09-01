async function translateSystemName(system) {
	const systemNames = {
		DiceBot: "通常ダイス",
		Cthulhu: "CoC6版",
		Cthulhu7th: "CoC7版",
		ShinobiGami: "シノビガミ",
		DoubleCross: "ダブルクロス3rd",
		Emoklore: "エモクロア",
		KyokoShinshoku: "虚構侵蝕",
		"SwordWorld2.5": "ソード・ワールド2.5",
		NRR: "nRR",
	};
	return systemNames[system] || system;
}

module.exports = { translateSystemName };
