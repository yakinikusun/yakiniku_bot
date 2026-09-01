const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();
var random;
const EXCLUSION_CHANNEL = process.env.EXCLUSION_CH || null;

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