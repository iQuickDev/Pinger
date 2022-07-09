const fs = require('fs')

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
            //console.log(pingsRole)

            console.log(client.guild.cache.get(reaction.guild.id))

            // add role to user
        })

        client.on('messageReactionRemove', (reaction, user) =>
        {
            if (user.bot) return
            if (reaction.emoji.name != '🔔') return

            let channel = reaction.message.channel
            let pingsRole = channel.guild.roles.cache.find(role => role.name === 'pings')

            console.log('user unreacted')
            //user.roles.remove(pingsRole)

            // remove role from user
        })
    }

    async init(server, channelCount) {

        server.roles.create({
            name: 'pings',
            color: '#ff0000',
        })

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
                    JSON.stringify({ msgID: message.id, channelID: channel.id }))
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

        this.pingChannels.forEach(async channel => {
            this.intervals.push(setInterval(async () => {
                channel.send('@everyone')
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
}