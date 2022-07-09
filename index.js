const dotenv = require('dotenv')
dotenv.config()
const { Client } = require('discord.js')
const Commands = require('./commands')
const PREFIX = process.env.BOT_PREFIX

const client = new Client({
    intents: 3276799,
    partials: ['MESSAGE', 'REACTION', 'GUILD_MEMBER'],
})

const cmds = new Commands(client)

client.on('ready', () =>
{
    console.log('ready to shoot')
})

client.on('message', (message) =>
{
    if (message.author.bot) return

    if (message.content.startsWith(PREFIX))
    {
        let command = message.content.split(' ')[0].slice(PREFIX.length)
        let args = message.content.split(' ').slice(1)
        switch (command)
        {
            case 'init':
                cmds.init(message.guild, args[0])
                break
            case 'startping':
                cmds.startPing(message)
                break
            case 'pauseping':
                cmds.pausePing()
                break
            case 'restore':
                cmds.restore(message.guild)
                break
            case 'help':
                cmds.help(message)
                break
        }
    }
})

client.login(process.env.CLIENT_SECRET)