module.exports = {
    name: ['compile'],
    args: [{ "name": "language", "required": true, "specifarg": false, "orig": "<language>" }, { "name": "code", "required": true, "specifarg": false, "orig": "<code>" }],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })

        var saidMessage = args.slice(1).join(' ')
        var language = args[1]

        var cl = -1
        var codeBlock = (saidMessage.match(/```[\s\S]+```/) ?? [])[0]
        if (codeBlock) {
            var codeLang = (codeBlock.match(/```[^\n\r]+[\n\r]/) ?? [])[0]
            if (codeLang) {
                cl = codeLang.length
                language = codeLang.substring(3).trim()
            }
        }

        var langresponse = await poopy.modules.axios.get('https://wandbox.org/api/list.json').catch(() => { })

        if (!langresponse) return

        var languages = langresponse.data.filter((lang, index) => langresponse.data.findIndex(l => l.templates[0] === lang.templates[0]) === index).sort((a, b) => {
            if (a.templates[0] < b.templates[0]) return -1
            if (a.templates[0] > b.templates[0]) return 1
            return 0
        })

        if (language === undefined) {
            await msg.reply(`What is the programming language?! Available ones are:\n${languages.map(lang => `\`${lang.templates[0]}\``).join(', ')}`).catch(() => { })
            return
        }

        saidMessage = args.slice(cl > -1 ? 1 : 2).join(' ')
        if (codeBlock) saidMessage = saidMessage.substring(cl > -1 ? cl : 3, saidMessage.length - 3).trim()
        var langVersion

        var findLang = languages.find(lang => lang.templates[0] === language.toLowerCase())

        if (findLang) {
            langVersion = findLang.name
        } else {
            await msg.reply(`Not a valid programming language.\nAvailable ones are: ${languages.map(lang => `\`${lang.templates[0]}\``).join(', ')}`).catch(() => { })
            return
        }

        var response = await poopy.modules.axios.request({
            url: 'https://wandbox.org/api/compile.ndjson',
            method: 'POST',
            data: {
                code: saidMessage,
                codes: [],
                compiler: langVersion,
                'compiler-option-raw': "",
                description: "",
                options: "",
                'runtime-option-raw': "",
                stdin: "",
                title: ""
            }
        }).catch(async err => {
            await msg.reply({
                content: err.stack,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        })

        if (!response) return

        var jsons = response.data.trim().split('\n').map(json => JSON.parse(json))

        var stdOut = jsons.find(json => json.type === 'StdOut')
        var stdErr = jsons.find(json => json.type === 'StdErr')
        var output

        if (stdOut && stdErr) output = `StdOut: ${stdOut.data}\n\nStdErr: ${stdErr.data}`
        else output = (stdOut ?? stdErr) ? (stdOut ?? stdErr).data : 'No output.'

        await msg.reply({
            content: output,
            allowedMentions: {
                parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
            }
        }).catch(() => { })
    },
    help: {
        name: 'compile <language> <code>',
        value: 'Compiles the code in the specified language using Wandbox.\n' +
            'Pro Tip: You can also just write a code block with the language at the start.'
    },
    type: 'Text'
}