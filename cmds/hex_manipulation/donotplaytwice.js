module.exports = {
    name: ['donotplaytwice', 'playtwice'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"}],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile, downloadFile, execPromise, findpreset, sendFile } = poopy.functions
        let modules = poopy.modules

        await msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[2] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = lastUrl(msg, 0)
        var fileinfo = await validateFile(currenturl).catch(async error => {
            await msg.reply(error).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video')) {
            var filepath = await downloadFile(currenturl, `input.mp4`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp4`
            var audio = fileinfo.info.audio

            if (audio) {
                await execPromise(`ffmpeg -i ${filepath}/${filename} -vn -map_metadata -1 -c:a libvorbis -b:a 64k -ar 44100 -preset ${findpreset(args)} ${filepath}/44100.ogg`)

                await execPromise(`cat assets/donotplaytwice.ogg ${filepath}/44100.ogg assets/silence.ogg > ${filepath}/output.ogg`)

                return await sendFile(msg, filepath, `output.ogg`)
            } else {
                await msg.reply('No audio stream detected.').catch(() => { })
                await msg.channel.sendTyping().catch(() => { })
                modules.fs.rmSync(`${filepath}`, { force: true, recursive: true })
            }
        } else if (type.mime.startsWith('audio')) {
            var filepath = await downloadFile(currenturl, `input.mp3`, {
                fileinfo: fileinfo
            })
            var filename = `input.mp3`
            await execPromise(`ffmpeg -i ${filepath}/${filename} -vn -map_metadata -1 -c:a libvorbis -b:a 64k -ar 44100 -preset ${findpreset(args)} ${filepath}/44100.ogg`)

            await execPromise(`cat assets/donotplaytwice.ogg ${filepath}/44100.ogg assets/silence.ogg > ${filepath}/output.ogg`)

            return await sendFile(msg, filepath, `output.ogg`)
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
        name: 'donotplaytwice/playtwice {file}',
        value: `Creates a "DO NOT PLAY THIS AUDIO TWICE" ogg with the audio. Probably doesn't work now...`
    },
    cooldown: 2500,
    type: 'Hex Manipulation'
}
