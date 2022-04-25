module.exports = {
    name: ['loophole'],
    execute: async function (msg, args) {
        let poopy = this

        msg.channel.sendTyping().catch(() => { })
        if (poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] === undefined && args[1] === undefined) {
            msg.channel.send('What is the file?!').catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return;
        };
        var currenturl = poopy.data[poopy.config.mongodatabase]['guild-data'][msg.guild.id]['channels'][msg.channel.id]['lastUrl'] || args[1]
        var fileinfo = await poopy.functions.validateFile(currenturl).catch(error => {
            msg.channel.send(error)
            msg.channel.sendTyping().catch(() => { })
            return;
        })

        if (!fileinfo) return
        var type = fileinfo.type

        if (type.mime.startsWith('video') || (type.mime.startsWith('image'))) {
            var filepath = await poopy.functions.downloadFile(currenturl, `input.${fileinfo.shortext}`, {
                fileinfo: fileinfo
            })
            var filename = `input.${fileinfo.shortext}`
            var width = fileinfo.info.width
            var height = fileinfo.info.height

            await poopy.functions.execPromise(`ffmpeg -stream_loop -1 -t 1 -i ${filepath}/${filename} -stream_loop -1 -t 1 -i ${filepath}/${filename} -f lavfi -stream_loop -1 -t 1 -r 50 -i "color=0x00000000:s=${width}x${height},format=rgba" -filter_complex "[0:v]fps=50,scale=${width}*(t*4+1):${height}*(t*4+1):eval=frame[overlay];[1:v]fps=50,scale=${width}*t:${height}*t:eval=frame[overlay2];[2:v][overlay]overlay=x=(W-w)/2:y=(H-h)/2:format=auto[zoom];[zoom][overlay2]overlay=x=(W-w)/2:y=(H-h)/2:format=auto,scale='min(400,iw)':min'(400,ih)':force_original_aspect_ratio=decrease,split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${poopy.functions.findpreset(args)} -y -shortest -gifflags -offsetting ${filepath}/output.gif`)
            await poopy.functions.sendFile(msg, filepath, `output.gif`)
        } else {
            msg.channel.send({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('ADMINISTRATOR') && !msg.member.permissions.has('MENTION_EVERYONE') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'loophole <file>',
        value: 'Creates an infinite zooming in loophole with the file.'
    },
    cooldown: 2500,
    type: 'Animation'
}