module.exports = {
    name: ['ratemyfarts'],
    args: [],
    execute: async function (msg) {
        let poopy = this
        let tempdata = poopy.tempdata

        await msg.channel.sendTyping().catch(() => { })
        await msg.reply('Let\'s see...').catch(() => { })
        var fartRating = Math.floor(Math.random() * 101)
        if (!tempdata[msg.author.id]['fartRate']) {
            tempdata[msg.author.id]['fartRate'] = fartRating;
        }
        if (!tempdata[msg.author.id]['lastFartRate']) {
            tempdata[msg.author.id]['lastFartRate'] = Date.now();
        }
        var lastFartRating = Date.now() - tempdata[msg.author.id]['lastFartRate']
        if (lastFartRating >= 600000) {
            tempdata[msg.author.id]['fartRate'] = fartRating;
            tempdata[msg.author.id]['lastFartRate'] = Date.now();
        }
        if (tempdata[msg.author.id]['fartRate'] >= 70) {
            await msg.reply('**' + tempdata[msg.author.id]['fartRate'] + '**/100, great farts!').catch(() => { })
        }
        else {
            await msg.reply('**' + tempdata[msg.author.id]['fartRate'] + '**/100').catch(() => { })
        }
        await msg.channel.sendTyping().catch(() => { })
    },
    help: { name: 'ratemyfarts', value: 'Poopy rates your farts.' },
    cooldown: 2500,
    type: 'OG'
}