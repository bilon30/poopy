module.exports = {
    name: ['pillow', 'bodypillow'],
    args: [{"name":"file","required":false,"specifarg":false,"orig":"{file}"}],
    execute: async function (msg, args) {
        let poopy = this
        let { lastUrl, validateFile, downloadFile, execPromise, findpreset, sendFile } = poopy.functions
        let vars = poopy.vars

        await msg.channel.sendTyping().catch(() => { })
        if (lastUrl(msg, 0) === undefined && args[1] === undefined) {
            await msg.reply('What is the file?!').catch(() => { })
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

        if (type.mime.startsWith('image') && !(vars.gifFormats.find(f => f === type.ext))) {
            var filepath = await downloadFile(currenturl, `input.png`, {
                fileinfo            })
            var filename = `input.png`
            await execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/image/pillow.png -i assets/image/pillowmask.png -i assets/image/white.png -filter_complex "[1:v][0:v]scale2ref[pillow][image];[2:v][image]scale2ref[pillowmask][iimage];[3:v][iimage]scale2ref=w=iw*1.25:h=ih+(ow-iw)[white][iiimage];[iiimage][pillowmask]overlay=x=0:y=0:format=auto[imagemask];[imagemask][pillow]overlay=x=0:y=0:format=auto[pillow];[white][pillow]overlay=x=(W-w)/2:y=(H-h)/2:format=auto[out]" -map "[out]" -preset ${findpreset(args)} ${filepath}/output.png`)
            return await sendFile(msg, filepath, `output.png`)
        } else if (type.mime.startsWith('video')) {
            var filepath = await downloadFile(currenturl, `input.mp4`, {
                fileinfo            })
            var filename = `input.mp4`
            await execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/image/pillow.png -i assets/image/pillowmask.png -i assets/image/white.png -map 0:a? -filter_complex "[1:v][0:v]scale2ref[pillow][image];[2:v][image]scale2ref[pillowmask][iimage];[3:v][iimage]scale2ref=w=iw*1.25:h=ih+(ow-iw)[white][iiimage];[iiimage][pillowmask]overlay=x=0:y=0:format=auto[imagemask];[imagemask][pillow]overlay=x=0:y=0:format=auto[pillow];[white][pillow]overlay=x=(W-w)/2:y=(H-h)/2:format=auto[oout];[oout]scale=ceil(iw/2)*2:ceil(ih/2)*2[out]" -map "[out]" -preset ${findpreset(args)} -c:v libx264 -pix_fmt yuv420p ${filepath}/output.mp4`)
            return await sendFile(msg, filepath, `output.mp4`)
        } else if (type.mime.startsWith('image') && vars.gifFormats.find(f => f === type.ext)) {
            var filepath = await downloadFile(currenturl, `input.gif`, {
                fileinfo            })
            var filename = `input.gif`
            await execPromise(`ffmpeg -i ${filepath}/${filename} -i assets/image/pillow.png -i assets/image/pillowmask.png -i assets/image/white.png -filter_complex "[1:v][0:v]scale2ref[pillow][image];[2:v][image]scale2ref[pillowmask][iimage];[3:v][iimage]scale2ref=w=iw*1.25:h=ih+(ow-iw)[white][iiimage];[iiimage][pillowmask]overlay=x=0:y=0:format=auto[imagemask];[imagemask][pillow]overlay=x=0:y=0:format=auto[pillow];[white][pillow]overlay=x=(W-w)/2:y=(H-h)/2:format=auto[oout];[oout]split[pout][ppout];[ppout]palettegen=reserve_transparent=1[palette];[pout][palette]paletteuse=alpha_threshold=128[out]" -map "[out]" -preset ${findpreset(args)} -gifflags -offsetting ${filepath}/output.gif`)
            return await sendFile(msg, filepath, `output.gif`)
        } else {
            await msg.reply({
                content: `Unsupported file: \`${currenturl}\``,
                allowedMentions: {
                    parse: ((!msg.member.permissions.has('Administrator') && !msg.member.permissions.has('MentionEveryone') && msg.author.id !== msg.guild.ownerID) && ['users']) || ['users', 'everyone', 'roles']
                }
            }).catch(() => { })
            await msg.channel.sendTyping().catch(() => { })
            return
        }
    },
    help: {
        name: 'pillow/bodypillow {file}',
        value: 'Creates a pillow with the file.'
    },
    cooldown: 2500,
    type: 'Memes'
}