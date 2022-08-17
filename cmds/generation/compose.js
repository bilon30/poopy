module.exports = {
    name: ['compose', 'generatemusic'],
    args: [{"name":"style","required":false,"specifarg":true,"orig":"[-style <musicStyle>]"},{"name":"density","required":false,"specifarg":true,"orig":"[-density <value (from 0 to 2)>]"},{"name":"temperature","required":false,"specifarg":true,"orig":"[-temperature <value (from 0 to 3))>]"}],
    execute: async function (msg, args) {
        let poopy = this

        await msg.channel.sendTyping().catch(() => { })

        var styles = [
            'piano',
            'chamber',
            'rock_and_metal',
            'synth',
            'church',
            'timpani_strings_harp',
            'country',
            'reggae'
        ]
        var style = styles[Math.floor(Math.random() * styles.length)]
        var styleindex = args.indexOf('-style')
        if (styleindex > -1) {
            if (styles.find(style => style === args[styleindex + 1].toLowerCase())) {
                style = args[styleindex + 1].toLowerCase()
            } else {
                await msg.channel.send('Not a supported style.').catch(() => { })
                return
            }
        }

        var densities = [
            'low',
            'medium',
            'high'
        ]
        var density = densities[Math.floor(Math.random() * densities.length)]
        var densityindex = args.indexOf('-density')
        if (densityindex > -1) {
            density = densities[poopy.functions.parseNumber(args[densityindex + 1], { dft: Math.floor(Math.random() * densities.length), min: 0, max: densities.length - 1, round: true })]
        }

        var temperatures = [
            'low',
            'medium',
            'high',
            'very_high'
        ]
        var temperature = temperatures[Math.floor(Math.random() * temperatures.length)]
        var temperatureindex = args.indexOf('-temperature')
        if (temperatureindex > -1) {
            temperature = temperatures[poopy.functions.parseNumber(args[temperatureindex + 1], { dft: Math.floor(Math.random() * temperatures.length), min: 0, max: temperatures.length - 1, round: true })]
        }

        var createResponse = await poopy.modules.axios.request({
            method: 'POST',
            url: 'https://hf.space/embed/ai-guru/composer/task/create',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                music_style: style,
                density: density,
                temperature: temperature
            }
        }).catch(async () => {
            await msg.channel.send('Error generating song.').catch(() => { })
        })

        if (!createResponse) return

        async function finishMusic() {
            var res = await poopy.modules.axios.get(`https://hf.space/embed/ai-guru/composer/task/poll?task_id=${createResponse.data.task_id}`).catch(() => { })

            if (!res || res.data.status != 'completed') {
                await poopy.functions.sleep(2000)
                return finishMusic()
            }

            return Buffer.from(res.data.output.audio.split(',')[1], 'base64')
        }

        var musicData = await finishMusic().catch(() => { })

        var filepath = await poopy.functions.downloadFile(musicData, `output.wav`, {
            buffer: true
        })
        return await poopy.functions.sendFile(msg, filepath, `output.wav`)
    },
    help: {
        name: 'compose/generatemusic [-style <musicStyle>] [-density <value (from 0 to 2)>] [-temperature <value (from 0 to 3))>]',
        value: 'Generates a random music from AI. Available music styles are piano, chamber, rock_and_metal, synth, church, timpani_strings_harp, country, and reggae. Try it yourself at https://huggingface.co/spaces/ai-guru/composer'
    },
    type: 'Generation'
}