module.exports = {
    name: ['battlestats', 'userstats'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined) {
            if (!poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]) {
                poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id] = {}
            }
            if (!poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['health']) {
                poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['health'] = 100
            }
            var sendObject = {
                embeds: [{
                    title: msg.author.username + '\'s Stats',
                    color: 0x472604,
                    footer: {
                        icon_url: poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        text: poopy.bot.user.username
                    },
                    fields: [
                        {
                            name: "Health",
                            value: poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['health'] + ' HP'
                        }
                    ]
                }],
                content: `***${msg.author.username}'s Stats***\n\nHealth: \`${poopy.data[poopy.config.mongodatabase]['user-data'][msg.author.id]['health']} HP\``
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }
            if (poopy.config.textEmbeds) delete sendObject.embeds
            else delete sendObject.content
            msg.channel.send(sendObject).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        }
        if (!msg.mentions.members.size) {
            async function getMember(id) {
                var member = await poopy.bot.users.fetch(id)
                    .catch(function () {
                        msg.channel.send({
                            content: 'Invalid user id: **' + id + '**',
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                        msg.channel.sendTyping().catch(() => { })
                        return
                    })

                if (member) {
                    if (!poopy.data[poopy.config.mongodatabase]['user-data'][member.id]) {
                        poopy.data[poopy.config.mongodatabase]['user-data'][member.id] = {}
                    }
                    if (!poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health']) {
                        poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health'] = 100
                    }
                    var sendObject = {
                        embeds: [{
                            title: member.username + '\'s Stats',
                            color: 0x472604,
                            footer: {
                                icon_url: poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                                text: poopy.bot.user.username
                            },
                            fields: [
                                {
                                    name: "Health",
                                    value: poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health'] + ' HP'
                                }
                            ]
                        }],
                        content: `***${member.username}'s Stats***\n\nHealth: \`${poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['health']} HP\``
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }
                    if (poopy.config.textEmbeds) delete sendObject.embeds
                    else delete sendObject.content
                    msg.channel.send(sendObject).catch(() => { })
                    msg.channel.sendTyping().catch(() => { })
                }
            }

            getMember(args[1]);
        }
        else {
            var mention = msg.mentions.members.first();
            if (!poopy.data[poopy.config.mongodatabase]['user-data'][mention.id]) {
                poopy.data[poopy.config.mongodatabase]['user-data'][mention.id] = {}
            }
            if (!poopy.data[poopy.config.mongodatabase]['user-data'][mention.id]['health']) {
                poopy.data[poopy.config.mongodatabase]['user-data'][mention.id]['health'] = 100
            }
            var sendObject = {
                embeds: [{
                    title: mention.user.username + '\'s Stats',
                    color: 0x472604,
                    footer: {
                        icon_url: poopy.bot.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }),
                        text: poopy.bot.user.username
                    },
                    fields: [
                        {
                            name: "Health",
                            value: poopy.data[poopy.config.mongodatabase]['user-data'][mention.id]['health'] + ' HP'
                        }
                    ]
                }],
                content: `***${mention.user.username}'s Stats***\n\nHealth: \`${poopy.data[poopy.config.mongodatabase]['user-data'][mention.id]['health']} HP\``
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }
            if (poopy.config.textEmbeds) delete sendObject.embeds
            else delete sendObject.content
            msg.channel.send(sendObject).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
        }
    },
    help: {
        name: 'battlestats/userstats {user}',
        value: "Shows the user's battle stats."
    },
    cooldown: 2500,
    type: 'Battling'
}