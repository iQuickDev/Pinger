const fs = require('fs')
const values = require('./values.json')

module.exports = class Commands {
    intervals
    pingChannels
    client
    reactionMsg

    constructor(client) {
        this.intervals = []
        this.pingChannels = []
        this.client = client

        client.on('messageReactionAdd', (reaction, user) => {
            if (user.bot) return
            if (reaction.emoji.name != '🔔') return

            let channel = reaction.message.channel
            let pingsRole = channel.guild.roles.cache.find(role => role.name === 'pings')
            let guild = client.guilds.cache.get(reaction.message.guild.id)

            guild.members.cache.get(user.id).roles.add(pingsRole)            
        })

        client.on('messageReactionRemove', (reaction, user) =>
        {
            if (user.bot) return
            if (reaction.emoji.name != '🔔') return

            let channel = reaction.message.channel
            let pingsRole = channel.guild.roles.cache.find(role => role.name === 'pings')
            let guild = client.guilds.cache.get(reaction.message.guild.id)

            guild.members.cache.get(user.id).roles.remove(pingsRole) 
        })
    }

    async init(server, channelCount) {

        let pingRole

        server.roles.create({
            name: 'pings',
            color: '#ff0000',
        }).then(role => pingRole = role.id)

        let everyone = server.roles.cache.find(role => role.name === '@everyone')

        server.channels.create(`react-pings`, {
            type: 'text',
            permissionOverwrites: [
                {
                    id: everyone.id,
                    deny: ['SEND_MESSAGES']
                }
            ]
        }).then(async channel => {
            channel.send('**React to this message to receive pings**').then(async message => {
                await message.react('🔔')
                fs.writeFileSync(`${__dirname}/values.json`,
                    JSON.stringify({ msgID: message.id, channelID: channel.id, roleID: pingRole }))
            })
        })

        for (let i = 0; i < channelCount; i++) {
            server.channels.create(`bot-ping-${i + 1}`)
            await new Promise(r => setTimeout(r, 500))
        }

        await this.refreshPingChannels(server)
    }

    async startPing(message) {
        await this.refreshPingChannels(message.guild)

        let pingRole = message.guild.roles.cache.get(values.roleID)

        this.pingChannels.forEach(async channel => {
            
            if (channel.name == 'react-pings')
                return

            this.intervals.push(setInterval(async () => {
                channel.send(`${pingRole}\nToggle pings by reacting in <#${values.channelID}>`)
                await new Promise(r => setTimeout(r, 1000))
            }, 1000))
        })
    }

    async pausePing() {
        this.intervals.forEach(interval => clearInterval(interval))
    }

    async restore(server) {
        let pingsRole = server.roles.cache.find(role => role.name === 'pings')

        server.roles.delete(pingsRole)

        let channels = []

        await this.refreshPingChannels(server)

        this.pingChannels.forEach(async channel => {
            channels.push(channel)
        })

        setInterval(() => {
            if (channels.length > 0) {
                channels.shift().delete()
            }
            else
                clearInterval()
        }, 500)
    }

    async refreshPingChannels(server) {
        this.pingChannels = await server.channels.cache.filter(channel => channel.name.startsWith('bot-ping') || channel.name == 'react-pings')
    }

    help(message)
    {
        message.channel.send('**Commands:**\n\n' +
            '`init <channelCount>` - Initialize the bot\n' +
            '`startping` - Start pinging\n' +
            '`pauseping` - Pause pinging\n' +
            '`restore` - Revert all changes made by the bot\n' +
            '`help` - Show this message\n' +
            'the commands prefix is ' + `**${process.env.BOT_PREFIX}**`)
    }
}