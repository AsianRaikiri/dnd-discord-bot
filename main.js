const {Client, GatewayIntentBits, Collection, ActivityType, PresenceUpdateStatus} = require('discord.js');
const winston = require('winston');
const dotenv = require('dotenv');
const {get:_commands} = require('./utils.js')
const fs = require('node:fs')
const path = require('node:path')

dotenv.config()
const logger = winston.createLogger( {
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'}),
        new winston.transports.Console( {format: winston.format.simple()})
    ]
})

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commands = get_commands();

for (const command in commands) {
    client.commands.set(command.data.name, command);
}

const events_path = path.join(__dirname, 'events');
const event_files = fs.readdirSync(events_path).filter(file => file.endsWith('.js'));

for (const file of event_files) {
	const file_path = path.join(events_path, file);
	const event = require(file_path);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.DISCORD_BOT_TOKEN)
client.user.setActivity('in on Everyone', {type: ActivityType.Listening});
client.user.setStatus(PresenceUpdateStatus.Online);