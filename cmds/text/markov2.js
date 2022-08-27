module.exports = {
    name: ['markov2'],
    args: [{"name":"minlength","required":false,"specifarg":true,"orig":"[-minlength <charNumber>]"},{"name":"randomsentences","required":false,"specifarg":true,"orig":"[-randomsentences]"}],
    execute: async function (msg, args) {
        let poopy = this
        let { getOption, parseNumber, markov } = poopy.functions
        let data = poopy.data
        let json = poopy.json
        let arrays = poopy.arrays
        let vars = poopy.vars
        let config = poopy.config
        let modules = poopy.modules

        var minlength = getOption(args, 'minlength', { dft: 5, splice: true, n: 1, join: true, func: (opt) => parseNumber(opt, { dft: 5, min: 1, max: 10000, round: true }) })
        var randomsentences = getOption(args, 'randomsentences', { dft: false, splice: true, n: 0, join: true })

        var messages = data['guild-data'][msg.guild.id]['messages'].slice().map(m => m.content)
        if (messages.length <= 0 || randomsentences) {
            messages = json.sentenceJSON.data.map(s => s.sentence).concat(arrays.psPasta)
        }
        await msg.channel.sendTyping().catch(() => { })

        var markovString = markov(messages, minlength)

        await msg.reply({
            content: markovString,
            allowedMentions: {
                parse: ((!msg.member.permissihas('ADMINISTRATOR') && !msg.member.permissihas('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }).catch(async () => {
            var currentcount = vars.filecount
            vars.filecount++
            var filepath = `temp/${config.mongodatabase}/file${currentcount}`
            modules.fs.mkdirSync(`${filepath}`)
            modules.fs.writeFileSync(`${filepath}/markov.txt`, markovString)
            await msg.reply({
                files: [new modules.Discord.MessageAttachment(`${filepath}/markov.txt`)]
            }).catch(() => { })
            modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
        })
    },
    help: {
        name: 'markov2 [-minlength <charNumber>] [-randomsentences]',
        value: 'the Poopy Markov includes last messages. this use different algorith.'
    },
    cooldown: 2500,
    type: 'Text'
}