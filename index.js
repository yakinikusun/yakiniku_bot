const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

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

client.on('messageCreate', async (message) => {
	if (message.author.bot) return
	if (message.content === 'うお' || message.content === 'うぉ' || message.content === 'うぉっ' || message.content === 'うおっ' || message.content === 'うおw' || message.content === 'うおW' || message.content === 'うおW' || message.content === 'おお' || message.content === 'おぉ') {
		await message.reply({
			content: ("鳥成分を検知"),
			allowedMentions: { repliedUser: false },
			flags: 'SuppressNotifications'
		});
		return
	}
});

client.login(process.env.TOKEN);