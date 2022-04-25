module.exports = {
    helpf: '(id | perm1 | perm2 | perm3 | etc...)',
    desc: 'Checks whether the user in the server with the respective ID has all the specified permissions or not. (a list of permissions can be found in https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags)',
    func: async (matches, msg) => {
        let poopy = this

        var word = matches[1]
        var split = poopy.functions.splitKeyFunc(word)
        var id = split[0] ?? ''
        var perms = split.slice(1).length ? split.slice(1) : ''
        var permlist = poopy.modules.Discord.Permissions.FLAGS

        for (var i in perms) {
            var perm = perms[i]

            if (!(permlist[perm])) {
                return `Invalid permission: ${perm}`
            }
        }

        var user = await msg.guild.members.fetch(id).catch(() => { })

        if (user) {
            for (var i in perms) {
                var perm = perms[i]

                if (!(user.permissions.has(perm))) {
                    return ''
                }
            }
        } else {
            return 'Invalid user ID.'
        }

        return 'true'
    }
}