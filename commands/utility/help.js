const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("Helps you see all the commands that this bot provides"),
async execute(interaction){
    await interaction.reply(`There are no commands yet. The user to call the command is ${interaction.user.username}`)
}
}