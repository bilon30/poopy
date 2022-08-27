module.exports = {
    name: ['describeimage'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"}],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile } = poopy.functions
        let modules = poopy.modules

        await msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file to recognize?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0) || args[1]
        var fileinfo = await validateFile(currenturl).catch(async error => {
            await msg.reply(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('image')) {
            var options = {
                url: 'https://hf.space/embed/Salesforce/BLIP/+/api/predict/',
                method: 'POST',
                data: { data: [`data:${type.mime};base64,${fileinfo.buffer.toString('base64')}`, "Image Captioning", "None", "Nucleus sampling"] },
                headers: { 'Content-Type': 'application/json' }
            }

            var response = await modules.axios.request(options).catch(async () => {
                await msg.reply('Error.').catch(() => { })
            })

            if (!response) return

            await msg.reply({
                content: response.data.data[0].replace('caption: ', ''),
                allowedMentions: {
                    parse: ((!msg.member.permissihas('ADMINISTRATOR') && !msg.member.permissihas('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
        } else {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissihas('ADMINISTRATOR') && !msg.member.permissihas('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'describeimage {file}',
        value: "Describes the contents of an image. Try it yourself at https://huggingface.co/spaces/OFA-Sys/OFA-Image_Caption"
    },
    cooldown: 2500,
    type: 'Generation'
}