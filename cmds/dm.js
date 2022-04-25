module.exports = {
    name: ['dm'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (args[1] === undefined) {
            msg.channel.send('Who do I DM?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var anon = false
        var anonIndex = args.indexOf('-anonymous')
        if (anonIndex > -1) {
            args.splice(anonIndex, 1)
            anon = true
        }
        var saidMessage = args.join(' ').substring(args[0].length + args[1].length + 2)
        var attachments = []
        msg.attachments.forEach(attachment => {
            attachments.push(new poopy.modules.Discord.MessageAttachment(attachment.url))
        });
        if (args[2] === undefined && attachments.length <= 0) {
            msg.channel.send('What is the message to DM?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        if (!msg.mentions.members.size) {
            var id = args[1]

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
                });

            if (member) {
                if (!poopy.data[poopy.config.mongodatabase]['user-data'][member.id]) {
                    poopy.data[poopy.config.mongodatabase]['user-data'][member.id] = {}
                }
                if (!poopy.tempdata[member.id]) {
                    poopy.tempdata[member.id] = {}
                }
                if (member.id === msg.author.id) {
                    member.send({
                        content: (anon ? '' : `${msg.author.tag} from ${msg.guild.name}:\n\n`) + saidMessage,
                        files: attachments
                    }).then(function () {
                        msg.react('✅').catch(() => { })
                        msg.channel.sendTyping().catch(() => { })
                    })
                        .catch(function () {
                            msg.channel.send('unblock me').catch(() => { })
                            msg.channel.sendTyping().catch(() => { })
                            return
                        })
                    return
                }
                if (poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['dms'] === undefined && !poopy.tempdata[member.id]['dmconsent']) {
                    poopy.tempdata[msg.author.id]['dmconsent'] = true

                    var pending = await msg.channel.send('Pending response.').catch(() => { })
                    var send = await poopy.functions.yesno(member, `${!anon ? msg.author.tag : 'Someone'} is trying to send you a message. Will you consent to any unrelated DMs sent with the \`dm\` command?`, member.id).catch(() => { })

                    if (send !== undefined) {
                        poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['dms'] = send
                        member.send({
                            content: `Unrelated DMs from \`dm\` will **${!send ? 'not ' : ''}be sent** to you now.`,
                            allowedMentions: {
                                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                            }
                        }).catch(() => { })
                        if (pending) {
                            pending.edit(send ? 'You can send DMs to the user now.' : 'blocked on twitter').catch(() => { })
                        }
                    } else {
                        pending.edit('Couldn\'t send a message to this user. Make sure they share any of the servers I\'m in, or not have me blocked.').catch(() => { })
                    }
                } else {
                    if (poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['dms'] === false) {
                        msg.channel.send('I don\'t have the permission to send unrelated DMs to this user.').catch(() => { })
                        msg.channel.sendTyping().catch(() => { })
                        return
                    }
                    member.send({
                        content: (!anon ? `${msg.author.tag} from ${msg.guild.name}:\n\n` : '') + saidMessage,
                        files: attachments
                    }).then(function () {
                        msg.react('✅').catch(() => { })
                        msg.channel.sendTyping().catch(() => { })
                    })
                        .catch(function () {
                            msg.channel.send('Couldn\'t send a message to this user. Make sure they share any of the servers I\'m in, or not have me blocked.').catch(() => { })
                            msg.channel.sendTyping().catch(() => { })
                            return
                        })
                }
            }
        }
        else {
            var member = msg.mentions.members.first()
            if (!poopy.data[poopy.config.mongodatabase]['user-data'][member.id]) {
                poopy.data[poopy.config.mongodatabase]['user-data'][member.id] = {}
            }
            if (!poopy.tempdata[member.id]) {
                poopy.tempdata[member.id] = {}
            }
            if (member.id === msg.author.id) {
                member.send({
                    content: (anon ? '' : `${msg.author.tag} from ${msg.guild.name}:\n\n`) + saidMessage,
                    files: attachments
                }).then(function () {
                    msg.react('✅').catch(() => { })
                    msg.channel.sendTyping().catch(() => { })
                })
                    .catch(function () {
                        msg.channel.send('unblock me').catch(() => { })
                        msg.channel.sendTyping().catch(() => { })
                        return
                    })
                return
            }
            if (poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['dms'] === undefined && !poopy.tempdata[member.id]['dmconsent']) {
                poopy.tempdata[msg.author.id]['dmconsent'] = true

                var pending = await msg.channel.send('Pending response.').catch(() => { })
                var send = await poopy.functions.yesno(member, `${!anon ? msg.author.tag : 'Someone'} is trying to send you a message. Will you consent to any unrelated DMs sent with the \`dm\` command?`, member.id).catch(() => { })

                if (send !== undefined) {
                    poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['dms'] = send
                    member.send({
                        content: `Unrelated DMs from \`dm\` will **${!send ? 'not ' : ''}be sent** to you now.`,
                        allowedMentions: {
                            parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                        }
                    }).catch(() => { })
                    if (pending) {
                        pending.edit(send ? 'You can send DMs to the user now.' : 'blocked on twitter').catch(() => { })
                    }
                } else {
                    pending.edit('Couldn\'t send a message to this user. Make sure they share any of the servers I\'m in, or not have me blocked.').catch(() => { })
                }
            } else {
                if (poopy.data[poopy.config.mongodatabase]['user-data'][member.id]['dms'] === false) {
                    msg.channel.send('I don\'t have the permission to send unrelated DMs to this user.').catch(() => { })
                    msg.channel.sendTyping().catch(() => { })
                    return
                }
                member.send({
                    content: (!anon ? `${msg.author.tag} from ${msg.guild.name}:\n\n` : '') + saidMessage,
                    files: attachments
                }).then(function () {
                    msg.react('✅').catch(() => { })
                    msg.channel.sendTyping().catch(() => { })
                })
                    .catch(function () {
                        msg.channel.send('Couldn\'t send a message to this user. Make sure they share any of the servers I\'m in, or not have me blocked.').catch(() => { })
                        msg.channel.sendTyping().catch(() => { })
                        return
                    })
            }
        }
    },
    help: {
        name: 'dm <user> <message> [-anonymous]',
        value: 'Allows Poopy to DM an user the message inside the command.'
    },
    type: 'Annoying'
}