const http = require('http');

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 8000;
// Koyebデプロイ後に発行される公開URLを環境変数で設定しておく
const SELF_URL = process.env.SELF_URL; // 例: https://your-app.koyeb.app

// --- ヘルスチェック用HTTPサーバー ---
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
});

server.listen(PORT, () => {
  console.log(`Health check server listening on port ${PORT}`);
});

// --- 自分自身に定期pingを送る ---
function startSelfPing() {
  if (!SELF_URL) {
    console.warn("SELF_URL not set. Skipping self-ping.");
    return;
  }

  setInterval(async () => {
    try {
      const res = await fetch(SELF_URL);
      console.log(`Self-ping OK: ${res.status}`);
    } catch (err) {
      console.error("Self-ping failed:", err.message);
    }
  }, 10 * 60 * 1000); // 10分ごと
}

startSelfPing();

// クライアントの作成
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// コマンドの読み込み
client.commands = new Collection();

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});


client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});


// メッセージ反応
client.on('messageCreate', async (message) => {
	if (message.author.bot) return
	if (['うお','うおっ','うおw','うおW','おお','おぉ'].includes(message.content) || message.content.includes('うぉ')) {
		await message.reply({
			content: ("鳥成分を検知"),
			allowedMentions: { repliedUser: false },
			flags: 'SuppressNotifications'
		});
		return
	}
});

client.login(process.env.TOKEN);