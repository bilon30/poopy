module.exports = {
    helpf: '(name | value)',
    desc: "Declares a variable with the name and value specified, but keywords and functions don't execute automatically. Variables can be used by typing in {variablename}.",
    func: async function (matches, msg, isBot, string) {
        let poopy = this

        var word = matches[1]
        var fullword = `${matches[0]}(${matches[1]})`
        var split = poopy.functions.splitKeyFunc(word)
        var name = await poopy.functions.getKeywordsFor(split[0] ?? '', msg, isBot).catch(() => { }) ?? ''
        name = poopy.functions.regexClean(name)
        var value = split.slice(1).length ? split.slice(1).join(' | ') : ''
        var phrase = string.replace(new RegExp(`${poopy.functions.regexClean(fullword)}\\s*`, 'i'), '')
        poopy.tempdata[msg.author.id]['declared'][`{${name}}`] = value.replace(new RegExp(`\\{${name}\\}`, 'ig'), poopy.tempdata[msg.author.id]['declared'][`{${name}}`] || '')
        var extrakeys = {}
        extrakeys[`{${name}}`] = {
            func: async () => {
                return await poopy.functions.getKeywordsFor(value.replace(new RegExp(`\\{${name}\\}`, 'ig'), poopy.tempdata[msg.author.id]['declared'][`{${name}}`] || ''), msg, isBot).catch(() => { }) ?? ''
            }
        }
        return [await poopy.functions.getKeywordsFor(phrase, msg, isBot, {
            extrakeys: extrakeys
        }).catch(() => { }) ?? string, true]
    },
    raw: true,
    attemptvalue: 10
}