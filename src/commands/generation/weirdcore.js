module.exports = {
    name: ['stablediffusion', 'weirdcore', 'text2img'],
    args: [{"name":"message","required":true,"specifarg":false,"orig":"<message>"},{"name":"single","required":false,"specifarg":true,"orig":"[-single]"}],
    execute: async function (msg, args) {
        let poopy = this
        let vars = poopy.vars
        let { addLastUrl, getOption } = poopy.functions
        let { deepai, Discord } = poopy.modules

        await msg.channel.sendTyping().catch(() => { })
        var single = getOption(args, 'single', { n: 0, splice: true, dft: false })
        var saidMessage = args.slice(1).join(' ')
        if (args[1] === undefined) {
            await msg.reply('What is the text?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        }
        if (vars.validUrl.test(saidMessage)) {
            await msg.reply('URLs in this command will break it.').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
        var resp = await deepai.callStandardApi(single ? "stable-diffusion" : "text2img", {
            text: saidMessage,
        }).catch(async err => {
            await msg.reply({
                content: err.stack,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        })
        if (resp) {
            if (msg.nosend) addLastUrl(msg, resp.output_url)
            else await msg.reply({
                files: [new Discord.AttachmentBuilder(resp.output_url)]
            }).catch(() => { })

            return resp.output_url
        }
        await msg.channel.sendTyping().catch(() => { })
    },
    help: {
        name: 'stablediffusion/weirdcore/text2img <message> [-single]',
        value: 'Generates a picture/pictures depending on what the text is with Stable Diffusion.'
    },
    cooldown: 2500,
    type: 'Generation',
    envRequired: ['DEEPAI_KEY']
}