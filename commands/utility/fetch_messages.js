const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('fetch_Message')
    .setDescription("Fetches the last few messages from a channel"),
async execute(interaction){
    messages = await getAllMessagesFromChannel(interaction.channel)
    messages.forEach(message =>{
        console.log(`\nMessage Text: \n${message.content}`)
    })
    await interaction.reply(`There are no commands yet. The user to call the command is ${interaction.user.username}`)
}
}

async function getAllMessagesFromChannel(channel) {
    const messages = [];
    let pack = await channel.messages.fetch({ limit: 100 });
    let pivot = pack.last();
    [...messages, ...pack];
  
    while (pivot !== undefined) {
      pack = await channel.messages.fetch({
        limit: 100,
        before: pivot.id,
      });
  
      pivot = pack.last();
      pack.forEach((entry) => messages.push(entry));
    }
  
    return messages;
}