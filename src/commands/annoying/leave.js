module.exports = {
    name: ['leave'],
    args: [],
    execute: async function (msg) {
        let poopy = this
        let config = poopy.config
        let { yesno } = poopy.functions
        let { Discord } = poopy.modules

        if (msg.channel.type == Discord.ChannelType.DM) {
            await msg.reply(`You can't get rid of me.`).catch(() => { })
            return
        }

        if (msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id)) {
            var phrases = [
                'idiot',
                'the salt',
                'why do you hate me',
                'i could kill you',
                'are you mentally disabled',
                'ratio',
                'now',
                'the audacity',
                'you like boys',
                'bull',
                'fat plumber mario',
                'im crying',
                'poopoo demon summoned',
                'im out of ass',
                'the poopening has begun',
                'scrotum cancer alert',
                'stop',
                'chance of meatballs',
                'the poopy boss has spawned',
                `you had one shot ${(msg.member.nickname || msg.author.username).toLowerCase()}`,
                'this is my undertale',
                'i hate the antichrist',
                'not the minors',
                'i can cut your body',
                'things i shoved up my arse',
                'negro',
                'what is the true meaning of nr n',
                'brought oil',
                'father figure',
                '<https://pikmin3.nintendo.com/buy-now/>',
                msg.member.toString(),
                'cum sock',
                'quesadilla',
                'pig',
                'youve missed the chance to try crab rice',
                'mug',
                '_ _'
            ]
            var confirm = await yesno(msg.channel, 'are you sure about this', msg.member, undefined, msg).catch(() => { })

            if (confirm) {
                await msg.reply(phrases[Math.floor(Math.random() * phrases.length)]).catch(() => { })
                
                if (msg.channel.type == Discord.ChannelType.GroupDM) msg.channel.delete().catch(() => { })
                else {
                    var left = await msg.guild.leave().catch(() => { })
                    await msg.channel?.send(left).catch(() => { })
                }
            }
        } else {
            await msg.reply('You need the manage server permission to execute that!').catch(() => { })
            return
        }
    },
    help: { name: 'leave (manage server only)', value: 'good' },
    perms: ['Administrator', 'ManageGuild'],
    type: 'Annoying'
}