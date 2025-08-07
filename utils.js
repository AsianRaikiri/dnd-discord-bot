const fs = require('node:fs')
const path = require('node:path')

export function get_commands() {
    "This is some kind of docstring"
    const folder_path = path.join(__dirname, 'commands');
    const commands_folder = fs.readdirSync(folder_path);
    commands = []
    for (const folder of commands_folder) {
        const command_path = path.join(folder_path, folder);
        const command_files = fs.readdirSync(command_path).filter(file => file.endsWith('.js'));
        for (const file of command_files) {
            const file_path = path.join(command_path, file);
            const command = require(file_path);
            if ('data' in command && 'execute' in command) {
                commands.push(command)
            } else {
                logger.warn(`The command at ${file_path} is missing the required "data" or "execute" property.`)
            }
        }
    }
    return commands
}
