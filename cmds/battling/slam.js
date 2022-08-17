module.exports = {
    name: ['slam'],
    args: [{"name":"subject","required":true,"specifarg":false,"orig":"<subject>"}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })
        var saidMessage = args.slice(1).join(' ')
        var attachments = []
        msg.attachments.forEach(attachment => {
            attachments.push(new poopy.modules.Discord.MessageAttachment(attachment.url))
        });
        if (args[1] === undefined && attachments.length <= 0) {
            await msg.channel.send('What/who is the subject?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        if ((Math.floor(Math.random() * 4)) === 0) {
            if (!msg.mentions.members.size) {
                async function getMember(id) {
                    var member = await poopy.bot.users.fetch(id)
                        .catch(async () => {
                            await msg.channel.send({
                                content: '<@' + msg.author.id + '> slammed **' + (saidMessage || 'this') + '**! It did **30** damage!',
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                },
                                files: attachments
                            }).catch(() => { })
                            await msg.channel.sendTyping().catch(() => { })
                        })

                    if (member) {
                        saidMessage = member.username
                        await msg.channel.send({
                            content: '<@' + msg.author.id + '> slammed **' + (saidMessage || 'this') + '**! It did **30** damage!',
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            },
                            files: attachments
                        }).catch(() => { })
                        if (!poopy.data['user-data'][member.id]) {
                            poopy.data['user-data'][member.id] = {}
                            poopy.data['user-data'][member.id]['health'] = 100
                        }
                        poopy.data['user-data'][member.id]['health'] = poopy.data['user-data'][member.id]['health'] - 30
                        if (poopy.data['user-data'][member.id]['health'] <= 0) {
                            poopy.data['user-data'][member.id]['health'] = 100
                            await msg.channel.send({
                                content: '**' + member.username + '** died!',
                                allowedMentions: {
                                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                                }
                            }).catch(() => { })
                            await msg.channel.sendTyping().catch(() => { })
                            return
                        }
                        await msg.channel.sendTyping().catch(() => { })
                    }
                }

                await getMember(saidMessage);
            }
            else {
                var member = msg.mentions.members.first()
                saidMessage = member.user.username
                await msg.channel.send({
                    content: '<@' + msg.author.id + '> slammed **' + (saidMessage || 'this') + '**! It did **30** damage!',
                    allowedMentions: {
                        parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                    },
                    files: attachments
                }).catch(() => { })
                if (!poopy.data['user-data'][member.id]) {
                    poopy.data['user-data'][member.id] = {}
                    poopy.data['user-data'][member.id]['health'] = 100
                }
                poopy.data['user-data'][member.id]['health'] = poopy.data['user-data'][member.id]['health'] - 30
                if (poopy.data['user-data'][member.id]['health'] <= 0) {
                    poopy.data['user-data'][member.id]['health'] = 100
                    await msg.channel.send({
                        content: '**' + member.user.username + '** died!',
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                    await msg.channel.sendTyping().catch(() => { })
                    return
                }
            }
        } else {
            await msg.channel.send('You missed!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
        }
    },
    help: {
        name: 'slam <subject>',
        value: 'Slam something! Has a high chance of missing.'
    },
    type: 'Battling'
}