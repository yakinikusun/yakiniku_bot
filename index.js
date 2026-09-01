const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');
const dotenv = require('dotenv');

dotenv.config();
var random;
const EXCLUSION_CHANNEL = process.env.EXCLUSION_CH || null;
const DICE_CHANNEL = process.env.DICE_CH || null;

// Discordクライアントの作成
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// コマンドの読み込み
client.commands = new Collection();

if (!fs.existsSync('./db')) {
    fs.mkdirSync('./db');
}
const db = new Database('./db/setting.db');
db.prepare(`CREATE TABLE IF NOT EXISTS DiceSystem (
    user_id INTEGER PRIMARY KEY,
    system TEXT NOT NULL
    );`).run();
const getUser = db.prepare(`SELECT * FROM DiceSystem WHERE user_id = ?`);

const commandsPath = path.join(__dirname, 'commands/utility');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        if (!DICE_CHANNEL || interaction.channelId === DICE_CHANNEL ) {
            await command.execute(interaction);
        }
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
    client.user.setActivity({
        name: "/help でコマンド一覧を表示",
        type: ActivityType.Custom,
    });
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// メッセージ受信時の処理
client.on('messageCreate', async (message) => {
    if (EXCLUSION_CHANNEL && message.channel.id === EXCLUSION_CHANNEL) return
    if (message.author.bot) return

    if (['うお', 'うおっ', 'うおw', 'うおW', 'おお', 'おぉ'].includes(message.content) || message.content.includes('うぉ')) {
        await message.reply({
            content: ("鳥成分を検知"),
            allowedMentions: { repliedUser: false },
            flags: 'SuppressNotifications'
        });
        return
    } else {
        random = Math.floor(Math.random() * 100) + 1;
        if (random <= 1) {
            random = Math.floor(Math.random() * 100) + 1;
            if (random <= 1) {
                await message.channel.send({
                    content: "# うおw",
                    flags: 'SuppressNotifications'
                });
            } else {
                await message.channel.send({
                    content: "うおw",
                    flags: 'SuppressNotifications'
                });
            }
        }
    }
});

client.login(process.env.TOKEN);