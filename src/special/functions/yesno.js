module.exports = {
    helpf: '(phrase) (manage messages only)',
    desc: 'Creates a new yes/no choice in the channel. Returns true if yes is chosen, blank otherwise. Has a cooldown.',
    func: async function (matches, msg, isBot) {
        let poopy = this
        let tempdata = poopy.tempdata
        let { yesno } = poopy.functions
        let globaldata = poopy.globaldata
        let data = poopy.data
        let config = poopy.config

        var word = matches[1]

        if (tempdata[msg.guild.id][msg.channel.id]['shut']) return ''

        if (globaldata['shit'].find(id => id === msg.author.id)) return 'shit'

        if (data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown']) {
            if ((data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) > 0 &&
                tempdata[msg.author.id]['cooler'] !== msg.id) {
                return `Calm down! Wait more ${(data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] - Date.now()) / 1000} seconds.`
            } else {
                data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = false
            }
        }

        tempdata[msg.author.id]['cooler'] = msg.id
        
        if (tempdata[msg.author.id][msg.id]['execCount'] >= 1 && data['guild-data'][msg.guild.id]['chaincommands'] == false && !(msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || isBot)) return 'You can\'t chain commands in this server.'
        if (tempdata[msg.author.id][msg.id]['execCount'] >= config.commandLimit * ((msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || isBot) ? 5 : 1)) return `Number of commands to run at the same time must be smaller or equal to **${config.commandLimit * ((msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || isBot) ? 5 : 1)}**!`
        tempdata[msg.author.id][msg.id]['execCount']++
        
        data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] = (data['guild-data'][msg.guild.id]['members'][msg.author.id]['coolDown'] || Date.now()) + 2500 / ((msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID) ? 5 : 1)

        if (msg.member.permissions.has('ManageGuild') || msg.member.permissions.has('ManageMessages') || msg.member.permissions.has('Administrator') || msg.author.id === msg.guild.ownerID || config.ownerids.find(id => id == msg.author.id) || isBot) {
            var result = await yesno(msg.channel, word, msg.member, undefined, msg).catch(() => { })
            return result ? 'true' : ''
        } else {
            return 'You need to have the manage messages permission to execute that!'
        }
    },
    attemptvalue: 10
}