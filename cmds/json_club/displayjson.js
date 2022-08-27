module.exports = {
    name: ['displayjson'],
    args: [{
        "name": "json", "required": true, "specifarg": false, "orig": "<json (psfiles, pspasta, funnygif, poop, dmphrases)>", "autocomplete": [
            'psfiles',
            'pspasta',
            'funnygif',
            'poop',
            'dmphrases'
        ]
    }],
    execute: async function (msg, args) {
        let poopy = this
        let config = poopy.config
        let vars = poopy.vars
        let modules = poopy.modules
        let globaldata = poopy.globaldata

        var jsonid = config.ownerids.find(id => id == msg.author.id) || config.jsoning.find(id => id == msg.author.id);
        if (jsonid === undefined) {
            await msg.reply('json club only').catch(() => { })
            return
        } else {
            var types = ['psfiles', 'pspasta', 'funnygif', 'poop', 'dmphrases']

            if (args[1] === undefined) {
                await msg.reply(`What is the JSON to display?! (Available: ${types.map(t => `**${t}**`).join(', ')})`).catch(() => { })
                return;
            }

            var type

            if (types.find(t => t === args[1].toLowerCase())) {
                type = args[1].toLowerCase()
            } else {
                await msg.reply('Not a JSON type.').catch(() => { })
                return
            }

            var currentcount = vars.filecount
            vars.filecount++
            var filepath = `temp/${config.mongodatabase}/file${currentcount}`
            modules.fs.mkdirSync(filepath)
            modules.fs.writeFileSync(`${filepath}/jsonlist.txt`, globaldata['bot-data'][type].join('\n\n-----------------------------------------------\n\n') || 'lmao theres nothing')
            await msg.reply({
                files: [new modules.Discord.MessageAttachment(`${filepath}/jsonlist.txt`)]
            }).catch(() => { })
            modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
        };
    },
    help: {
        name: 'displayjson <json (psfiles, pspasta, funnygif, poop, dmphrases)>',
        value: "Displays the values of a JSON like Phexonia Studio's files."
    },
    cooldown: 2500,
    type: 'JSON Club'
}