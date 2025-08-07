const {REST, Routes} = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');
const {get_commands} = require('./utils.js');
const { winston } = require('winston');
dotenv.config();
const logger = winston.createLogger( {
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.File({ filename: 'deploy_error.log', level: 'error'}),
        new winston.transports.File({filename: 'deploy_combined.log'}),
        new winston.transports.Console( {format: winston.format.simple()})
    ]
})

const command_list = get_commands();
const commands_json = [];
command_list.forEach(command => {
    commands_json.push(command.data.toJSON())    
});

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        logger.info(`Started refreshing ${command_list.length} application (/) commands`)

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_BOT_APP_ID),
            { body: commands_json}
        );
        logger.info(`Successfully reloaded ${data.length} application (/) commands`);
    }catch (error) {
        logger.error(error);
    }
})();